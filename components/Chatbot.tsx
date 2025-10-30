
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, UserProfile, NutritionGoals } from '../types';
import { getChatbotResponse } from '../services/geminiService';

interface ChatbotProps {
    userProfile: UserProfile;
    nutritionGoals: NutritionGoals;
    onBack: () => void;
    t: (key: string) => string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userProfile, nutritionGoals, onBack, t }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: t('chatbot.greeting').replace('{goal}', userProfile.goal) }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (messageText?: string) => {
        const textToSend = (messageText || input).trim();
        if (!textToSend || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: textToSend };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Pass the updated history to the service
            const responseText = await getChatbotResponse(newMessages, userProfile);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error: any) {
            const errorMessage: ChatMessage = { role: 'model', text: error.message || t('chatbot.error') };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickReplies = [
        t('chatbot.quick_reply_1'),
        t('chatbot.quick_reply_2'),
        t('chatbot.quick_reply_3'),
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] animate-fade-in dark:text-gray-200 text-gray-800">
            <header className="flex items-center mb-4 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                    <h1 className="text-xl font-bold">{t('chatbot.title')}</h1>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>Online</p>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded-2xl shadow-inner">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">AI</div>}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                         <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">AI</div>
                         <div className="px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="pt-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {quickReplies.map(reply => (
                        <button key={reply} onClick={() => handleSend(reply)} className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600">
                           {reply}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('chatbot.placeholder')}
                    className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800"
                    disabled={isLoading}
                />
                <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="bg-green-600 text-white p-3 rounded-xl shadow-md hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
