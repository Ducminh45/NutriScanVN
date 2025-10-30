
export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // General
    'back': 'Back',
    'save': 'Save',
    'settings': 'Settings',
    'error': 'Error',
    'loading': 'Loading...',
    // Nav
    'nav.home': 'Home',
    'nav.planning': 'Planning',
    'nav.scan': 'Scan',
    'nav.progress': 'Progress',
    'nav.settings': 'Settings',
    // Dashboard
    'dashboard.ai_assistant_title': 'AI Nutrition Assistant',
    'dashboard.ai_assistant_description': 'Ask me anything about food!',
    // Planning Tabs
    'planning.tabs.planner': 'Planner',
    'planning.tabs.recipes': 'Recipes',
    'planning.tabs.list': 'List',
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Your Profile',
    'settings.goals_activity': 'Goals & Activity',
    'settings.appearance': 'Appearance',
    'settings.dark_mode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.account': 'Account',
    'settings.logout': 'Log Out',
    'settings.save_changes': 'Save Changes',
    // Meal Planner
    'meal_planner.title': 'AI Meal Planner',
    'meal_planner.description_7day': 'Let AI create a personalized 7-day meal plan for you.',
    'meal_planner.generate_button': 'Generate New 7-Day Plan',
    'meal_planner.generating': 'Generating...',
    'meal_planner.save_plan': 'Save This Plan',
    'meal_planner.saved_plans': 'Saved Plans',
    'meal_planner.no_saved_plans': 'You have no saved plans yet. Generate a plan and save it!',
    'meal_planner.generate_list': 'Generate Shopping List',
    // Shopping List
    'shopping_list.title': 'Shopping List',
    'shopping_list.description': 'A list generated from your meal plan.',
    'shopping_list.clear_checked': 'Clear Checked',
    'shopping_list.clear_all': 'Clear All',
    'shopping_list.empty': 'Your shopping list is empty.',
    'shopping_list.empty_prompt': "Go to the 'Planner' tab to generate a list from a saved meal plan.",
    // Recipes
    'recipes.title': 'AI Recipe Book',
    'recipes.description': 'Generate a recipe for any Vietnamese dish.',
    'recipes.generate': 'Generate',
    // Chatbot
    'chatbot.title': 'AI Nutrition Assistant',
    'chatbot.greeting': "Hi! I'm Nutri-AI, your personal nutrition assistant. How can I help you achieve your goal of '{goal} weight'?",
    'chatbot.error': "I'm sorry, an error occurred.",
    'chatbot.placeholder': 'Ask about nutrition...',
    'chatbot.quick_reply_1': "Is 'bún bò Huế' healthy?",
    'chatbot.quick_reply_2': 'Suggest a low-calorie Vietnamese dinner.',
    'chatbot.quick_reply_3': "What's a good post-workout meal?",
  },
  vi: {
    // General
    'back': 'Quay lại',
    'save': 'Lưu',
    'settings': 'Cài đặt',
    'error': 'Lỗi',
    'loading': 'Đang tải...',
    // Nav
    'nav.home': 'Trang chủ',
    'nav.planning': 'Kế hoạch',
    'nav.scan': 'Quét',
    'nav.progress': 'Tiến độ',
    'nav.settings': 'Cài đặt',
    // Dashboard
    'dashboard.ai_assistant_title': 'Trợ lý Dinh dưỡng AI',
    'dashboard.ai_assistant_description': 'Hỏi tôi bất cứ điều gì về thực phẩm!',
    // Planning Tabs
    'planning.tabs.planner': 'Lập Kế hoạch',
    'planning.tabs.recipes': 'Công thức',
    'planning.tabs.list': 'Mua sắm',
    // Settings
    'settings.title': 'Cài đặt',
    'settings.profile': 'Hồ sơ của bạn',
    'settings.goals_activity': 'Mục tiêu & Hoạt động',
    'settings.appearance': 'Giao diện',
    'settings.dark_mode': 'Chế độ tối',
    'settings.language': 'Ngôn ngữ',
    'settings.account': 'Tài khoản',
    'settings.logout': 'Đăng xuất',
    'settings.save_changes': 'Lưu thay đổi',
    // Meal Planner
    'meal_planner.title': 'Kế hoạch Bữa ăn AI',
    'meal_planner.description_7day': 'Để AI tạo kế hoạch bữa ăn 7 ngày được cá nhân hóa cho bạn.',
    'meal_planner.generate_button': 'Tạo Kế hoạch 7 ngày mới',
    'meal_planner.generating': 'Đang tạo...',
    'meal_planner.save_plan': 'Lưu Kế hoạch này',
    'meal_planner.saved_plans': 'Kế hoạch đã lưu',
    'meal_planner.no_saved_plans': 'Bạn chưa có kế hoạch đã lưu nào. Hãy tạo và lưu một kế hoạch!',
    'meal_planner.generate_list': 'Tạo Danh sách Mua sắm',
    // Shopping List
    'shopping_list.title': 'Danh sách Mua sắm',
    'shopping_list.description': 'Danh sách được tạo từ kế hoạch bữa ăn của bạn.',
    'shopping_list.clear_checked': 'Xóa mục đã chọn',
    'shopping_list.clear_all': 'Xóa tất cả',
    'shopping_list.empty': 'Danh sách mua sắm của bạn trống.',
    'shopping_list.empty_prompt': "Đi đến tab 'Lập Kế hoạch' để tạo danh sách từ một kế hoạch đã lưu.",
    // Recipes
    'recipes.title': 'Sách Công thức AI',
    'recipes.description': 'Tạo công thức cho bất kỳ món ăn Việt Nam nào.',
    'recipes.generate': 'Tạo',
    // Chatbot
    'chatbot.title': 'Trợ lý Dinh dưỡng AI',
    'chatbot.greeting': "Chào bạn! Tôi là Nutri-AI, trợ lý dinh dưỡng cá nhân của bạn. Tôi có thể giúp gì để bạn đạt được mục tiêu '{goal} cân'?",
    'chatbot.error': 'Xin lỗi, đã có lỗi xảy ra.',
    'chatbot.placeholder': 'Hỏi về dinh dưỡng...',
    'chatbot.quick_reply_1': "Món 'bún bò Huế' có lành mạnh không?",
    'chatbot.quick_reply_2': 'Gợi ý một bữa tối Việt Nam ít calo.',
    'chatbot.quick_reply_3': 'Bữa ăn sau tập luyện nào tốt?',
  }
};

export const getTranslator = (language: Language) => (key: keyof typeof translations.en): string => {
  const typedKey = key as keyof typeof translations.en;
  return translations[language][typedKey] || translations.en[typedKey];
};
