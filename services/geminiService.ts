import { GoogleGenAI, Type } from "@google/genai";
// FIX: Imported ShoppingListItem to resolve type error.
import type { UserProfile, NutritionGoals, ScannedMeal, ChatMessage, MealPlan, ShoppingListCategory, ShoppingListItem, Recipe } from '../types';
import { Language } from "../i18n";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

type GeminiFoodResponse = Omit<ScannedMeal, 'id' | 'mealType' | 'date'>;

export const analyzeFoodImage = async (imageFile: File): Promise<GeminiFoodResponse> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: {
                parts: [
                    imagePart,
                    { text: "Analyze this image of a meal, likely Vietnamese food. Identify each food item, estimate its serving size, and provide its nutritional information (calories, protein, carbs, fat). Also, provide the total nutritional values for the entire meal. Your response MUST be in the specified JSON format." }
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        foodItems: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "Name of the food item (e.g., 'Phở Bò', 'Cơm Tấm Sườn Bì Chả')." },
                                    servingSize: { type: Type.STRING, description: "Estimated serving size (e.g., '1 bowl', '1 plate', '100g')." },
                                    calories: { type: Type.NUMBER, description: "Estimated calories in kcal." },
                                    protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
                                    carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams." },
                                    fat: { type: Type.NUMBER, description: "Estimated fat in grams." },
                                },
                                required: ["name", "servingSize", "calories", "protein", "carbs", "fat"]
                            }
                        },
                        totalCalories: { type: Type.NUMBER },
                        totalProtein: { type: Type.NUMBER },
                        totalCarbs: { type: Type.NUMBER },
                        totalFat: { type: Type.NUMBER },
                    },
                    required: ["foodItems", "totalCalories", "totalProtein", "totalCarbs", "totalFat"]
                },
            }
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as GeminiFoodResponse;
        
    } catch (error) {
        console.error("Error analyzing food image:", error);
        throw new Error("Failed to analyze image. The AI may be unable to identify the food, or there might be an issue with the service. Please try another image.");
    }
};

export const getChatbotResponse = async (history: ChatMessage[], userProfile: UserProfile): Promise<string> => {
    try {
        const systemInstruction = `You are Nutri-AI, a friendly and expert Vietnamese nutrition assistant for the NutriScanVN app. Your goal is to provide helpful, safe, and context-aware advice.
        - NEVER give medical advice. Always advise users to consult a doctor or registered dietitian for health concerns.
        - Your user's profile is: Age: ${userProfile.age}, Gender: ${userProfile.gender}, Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm.
        - Their goal is to ${userProfile.goal} weight.
        - Be encouraging and use a positive tone. Keep responses concise and easy to understand.
        - You can answer questions about food, suggest healthy Vietnamese meal alternatives, and explain nutritional concepts.`;

        const chat = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: systemInstruction,
            },
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }))
        });

        const lastMessage = history[history.length - 1];
        if (lastMessage.role !== 'user') throw new Error("Last message must be from user");
        
        const response = await chat.sendMessage({ message: lastMessage.text });
        
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        throw new Error("Sorry, I'm having trouble responding right now. Please try again later.");
    }
};


export const generateMealPlan = async (userProfile: UserProfile, goals: NutritionGoals, language: Language): Promise<Omit<MealPlan, 'id' | 'generatedDate'>> => {
    try {
        const langInstruction = language === 'vi' ? 'The entire response, including all dish names and plan names, MUST be in Vietnamese.' : 'The entire response must be in English.';
        const prompt = `You are a Vietnamese nutrition expert. Create a healthy, balanced, and delicious 7-day meal plan for a user with the following profile:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activityLevel}
- Main Goal: ${userProfile.goal} weight
- Daily Calorie Target: ~${goals.calories} kcal
- Allergies: ${userProfile.allergies || 'None'}

Focus on common, easy-to-prepare Vietnamese dishes. Ensure the plan is varied. Your response MUST be in the specified JSON format. ${langInstruction}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planName: { type: Type.STRING, description: "A creative name for the meal plan, like 'Healthy Vietnamese Week'." },
                        dailyPlans: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING, description: "The day, e.g., 'Day 1' or 'Ngày 1'" },
                                    totalCalories: { type: Type.NUMBER, description: "Estimated total calories for the day." },
                                    meals: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                mealType: { type: Type.STRING, description: "e.g., 'Breakfast', 'Lunch', 'Dinner' or 'Bữa sáng', 'Bữa trưa', 'Bữa tối'" },
                                                dishName: { type: Type.STRING, description: "The name of the Vietnamese dish." },
                                                calories: { type: Type.NUMBER, description: "Estimated calories for the dish." }
                                            },
                                            required: ["mealType", "dishName", "calories"]
                                        }
                                    }
                                },
                                required: ["day", "totalCalories", "meals"]
                            }
                        }
                    },
                    required: ["planName", "dailyPlans"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating meal plan:", error);
        throw new Error("Failed to generate a meal plan. The AI might be busy or unable to create a plan with the given constraints. Please try again.");
    }
};

export const generateShoppingList = async (mealPlan: MealPlan, language: Language): Promise<ShoppingListCategory[]> => {
     try {
        const langInstruction = language === 'vi' ? 'The entire response, including all category and item names, MUST be in Vietnamese.' : 'The entire response must be in English.';
        const prompt = `You are an expert at organizing shopping lists. Analyze this 7-day meal plan: ${JSON.stringify(mealPlan.dailyPlans)}. 
        Extract all necessary ingredients to make these dishes. 
        Consolidate duplicate ingredients. 
        Provide a reasonable quantity for each item for one person for 7 days.
        Group all items into logical grocery store categories (e.g., Produce, Meat & Seafood, Dairy & Eggs, Pantry Staples, Spices & Herbs).
        Your response MUST be in the specified JSON format. ${langInstruction}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING, description: "Category like 'Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Pantry Staples'."},
                            items: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING, description: "Name of the ingredient." },
                                        quantity: { type: Type.STRING, description: "Estimated quantity, e.g., '200g', '1 bunch', '2'." }
                                    },
                                    required: ["name", "quantity"]
                                }
                            }
                        },
                         required: ["category", "items"]
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const parsedList: (Omit<ShoppingListCategory, 'items'> & { items: Omit<ShoppingListItem, 'checked'>[] })[] = JSON.parse(jsonText);

        // Add the 'checked' property to each item
        return parsedList.map(category => ({
            ...category,
            items: category.items.map(item => ({ ...item, checked: false }))
        }));


    } catch (error) {
        console.error("Error generating shopping list:", error);
        throw new Error("Failed to generate a shopping list from the meal plan. Please try again.");
    }
};

export const generateRecipe = async (dishName: string, language: Language): Promise<Recipe> => {
    try {
        const langInstruction = language === 'vi' ? 'The entire response, including the title, description, ingredients, and instructions, MUST be in Vietnamese.' : 'The entire response must be in English.';
        const prompt = `You are a Vietnamese head chef. Create a detailed recipe for the dish: "${dishName}".
Provide a short, enticing description.
List all necessary ingredients clearly.
Provide clear, step-by-step instructions for preparation and cooking.
Finally, provide an estimated nutritional breakdown (calories, protein, carbs, fat) for one serving.
Your response MUST be in the specified JSON format. ${langInstruction}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        nutrition: {
                            type: Type.OBJECT,
                            properties: {
                                calories: { type: Type.NUMBER },
                                protein: { type: Type.NUMBER },
                                carbs: { type: Type.NUMBER },
                                fat: { type: Type.NUMBER },
                            },
                            required: ["calories", "protein", "carbs", "fat"],
                        },
                    },
                    required: ["title", "description", "ingredients", "instructions", "nutrition"],
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating recipe:", error);
        throw new Error(`Failed to generate a recipe for "${dishName}". Please check the name or try again.`);
    }
};