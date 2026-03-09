import React, { useState } from 'react';

const QUIZ_QUESTIONS = [
    {
        id: 'role',
        question: 'What is your primary role?',
        options: [
            { id: 'developer', label: 'Developer / Engineer' },
            { id: 'creative', label: 'Designer / Creative' },
            { id: 'content', label: 'Marketer / Writer' },
            { id: 'academic', label: 'Student / Educator' },
            { id: 'business', label: 'Business Owner / Operations' },
        ]
    },
    {
        id: 'goal',
        question: 'What is your main goal today?',
        options: {
            'developer': [
                { id: 'code', label: 'Write code faster' },
                { id: 'test', label: 'Automate testing' },
                { id: 'ui', label: 'Build UI' }
            ],
            'creative': [
                { id: 'image', label: 'Generate images' },
                { id: 'video', label: 'Edit video' },
                { id: 'wireframe', label: 'UI/UX wireframes' }
            ],
            'content': [
                { id: 'article', label: 'Long-form articles' },
                { id: 'social', label: 'Social media copy' },
                { id: 'seo', label: 'SEO optimization' }
            ],
            'academic': [
                { id: 'research', label: 'Research/Summarization' },
                { id: 'writing', label: 'Writing help' },
                { id: 'lesson', label: 'Lesson planning' }
            ],
            'business': [
                { id: 'admin', label: 'Automate admin' },
                { id: 'support', label: 'Customer support' },
                { id: 'analysis', label: 'Data analysis' }
            ]
        }
    },
    {
        id: 'technical',
        question: 'How technical are you?',
        options: [
            { id: 'beginner', label: 'Beginner (I just want it to work)' },
            { id: 'intermediate', label: 'Intermediate (I can handle basic setup)' },
            { id: 'advanced', label: 'Advanced (APIs, local models, complex workflows)' },
        ]
    },
    {
        id: 'budget',
        question: 'What is your monthly budget?',
        options: [
            { id: 'free', label: '$0 (Just free tools)' },
            { id: 'standard', label: '$10-$30/month (Standard SaaS)' },
            { id: 'premium', label: '$50+/month (Team/Enterprise)' },
        ]
    },
    {
        id: 'team',
        question: 'Are you working solo or with a team?',
        options: [
            { id: 'solo', label: 'Solo (Just me)' },
            { id: 'team', label: 'Team (Need shared workspaces)' },
        ]
    }
];

const RECOMMENDATION_MATRIX = [
    // Developer -> Code Faster
    { match: { role: 'developer', goal: 'code', budget: 'standard' }, primary: { name: 'Cursor IDE', url: '/tools/cursor-ide', type: 'Primary Winner' }, secondary: { name: 'GitHub Copilot', url: '/tools/github-copilot', type: 'Runner Up' } },
    { match: { role: 'developer', goal: 'code', budget: 'free' }, primary: { name: 'Claude (Free)', url: '/tools/claude-ai', type: 'Primary Winner' }, secondary: { name: 'ChatGPT Free', url: '/tools/chatgpt', type: 'Runner Up' } },
    { match: { role: 'developer', goal: 'ui' }, primary: { name: 'v0 by Vercel', url: '/tools/v0-dev', type: 'Primary Winner' }, secondary: { name: 'Claude Artifacts', url: '/tools/claude-ai', type: 'Runner Up' } },
    // Creative
    { match: { role: 'creative', goal: 'image', technical: 'advanced' }, primary: { name: 'Stable Diffusion', url: '/guides/midjourney-vs-dalle3-vs-stable-diffusion', type: 'Primary Winner' }, secondary: { name: 'Midjourney', url: '/tools/midjourney', type: 'Runner Up' } },
    { match: { role: 'creative', goal: 'image', technical: 'beginner' }, primary: { name: 'Midjourney', url: '/tools/midjourney', type: 'Primary Winner' }, secondary: { name: 'DALL-E 3', url: '/tools/chatgpt', type: 'Runner Up' } },
    { match: { role: 'creative', goal: 'video' }, primary: { name: 'Runway Gen-3', url: '/tools/runway-gen45', type: 'Primary Winner' }, secondary: { name: 'Midjourney', url: '/tools/midjourney', type: 'Runner Up' } },
    // Content
    { match: { role: 'content', goal: 'article', budget: 'standard' }, primary: { name: 'Claude Opus', url: '/tools/claude-ai', type: 'Primary Winner' }, secondary: { name: 'ChatGPT Plus', url: '/tools/chatgpt', type: 'Runner Up' } },
    { match: { role: 'content', goal: 'seo' }, primary: { name: 'ChatGPT Plus', url: '/tools/chatgpt', type: 'Primary Winner' }, secondary: { name: 'Claude Opus', url: '/tools/claude-ai', type: 'Runner Up' } },
    // Academic
    { match: { role: 'academic', goal: 'research' }, primary: { name: 'Perplexity AI', url: '/tools/perplexity-ai', type: 'Primary Winner' }, secondary: { name: 'Claude AI', url: '/tools/claude-ai', type: 'Runner Up' } },
    // Business
    { match: { role: 'business', goal: 'analysis' }, primary: { name: 'ChatGPT Plus (Advanced Data Analysis)', url: '/tools/chatgpt', type: 'Primary Winner' }, secondary: { name: 'Claude Opus', url: '/tools/claude-ai', type: 'Runner Up' } },

    // Default fallback
    { match: {}, primary: { name: 'ChatGPT', url: '/tools/chatgpt', type: 'Primary Winner' }, secondary: { name: 'Claude', url: '/tools/claude-ai', type: 'Runner Up' } }
];

export default function ToolFinder() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isComplete, setIsComplete] = useState(false);

    const handleSelect = (questionId, optionId) => {
        const newAnswers = { ...answers, [questionId]: optionId };
        setAnswers(newAnswers);

        if (currentStep < QUIZ_QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
        }
    };

    const getResults = () => {
        // Basic scoring algorithm to find the best match in the matrix
        let bestMatch = RECOMMENDATION_MATRIX[RECOMMENDATION_MATRIX.length - 1]; // Default
        let bestScore = -1;

        for (let i = 0; i < RECOMMENDATION_MATRIX.length - 1; i++) {
            const matchConditions = RECOMMENDATION_MATRIX[i].match;
            let score = 0;
            let isMatch = true;

            for (const [key, value] of Object.entries(matchConditions)) {
                if (answers[key] === value) {
                    score++;
                } else {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch && score > bestScore) {
                bestScore = score;
                bestMatch = RECOMMENDATION_MATRIX[i];
            }
        }

        return bestMatch;
    };

    if (isComplete) {
        const results = getResults();
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">We found your perfect match!</h2>
                    <p className="text-gray-600 dark:text-gray-300">Based on your workflow and budget, here is what we recommend.</p>
                </div>

                <div className="space-y-4">
                    <a href={results.primary.url} className="block p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">{results.primary.type}</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{results.primary.name}</h3>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium inline-flex items-center">
                            Read our full review
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </p>
                    </a>

                    <a href={results.secondary.url} className="block p-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{results.secondary.type}</div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{results.secondary.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm inline-flex items-center">
                            Check out the alternative
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-0L10 10.414l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a-1 1 0 010-0zM12.293 11.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-0L10 16.414l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a-1 1 0 010-0z" clipRule="evenodd" />
                            </svg>
                        </p>
                    </a>
                </div>

                <button
                    onClick={() => { setCurrentStep(0); setAnswers({}); setIsComplete(false); }}
                    className="mt-8 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 block text-center w-full"
                >
                    Retake the Quiz
                </button>
            </div>
        );
    }

    const currentQuestionData = QUIZ_QUESTIONS[currentStep];
    let optionsToDisplay = currentQuestionData.options;

    // Handle dynamic routing for Question 2
    if (currentQuestionData.id === 'goal') {
        optionsToDisplay = currentQuestionData.options[answers['role']] || [];
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-10 max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span>{Math.round(((currentStep) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {currentQuestionData.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
                {optionsToDisplay.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(currentQuestionData.id, option.id)}
                        className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 transition-all font-medium text-gray-700 dark:text-gray-200"
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {currentStep > 0 && (
                <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="mt-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
            )}
        </div>
    );
}
