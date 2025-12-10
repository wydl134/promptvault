-- Sample Prompts for PromptVault
--
-- IMPORTANT: Replace 'YOUR_USER_ID' with your actual user ID after signing up
-- You can find your user ID by running this query in Supabase SQL Editor:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';
--
-- Then run this entire file in the Supabase SQL Editor

-- Get category IDs (for reference)
-- SELECT id, name FROM categories;

-- Insert sample prompts
-- Make sure to replace 'YOUR_USER_ID' with your actual UUID from auth.users
INSERT INTO prompts (user_id, title, content, category_id, tags, is_public, likes_count, favorites_count, views_count)
SELECT
  'YOUR_USER_ID'::uuid,
  title,
  content,
  (SELECT id FROM categories WHERE name = category_name),
  tags,
  is_public,
  likes_count,
  favorites_count,
  views_count
FROM (VALUES
  (
    'Python Code Debugger',
    'You are an expert Python programmer. I will provide you with code that has bugs or errors. Your task is to:
1. Identify all issues in the code
2. Explain what each bug does and why it''s a problem
3. Provide the corrected version of the code
4. Add helpful comments explaining the fix

Please be thorough and educational in your explanations.',
    'Programming',
    ARRAY['python', 'debugging', 'coding', 'education'],
    true,
    42,
    18,
    234
  ),
  (
    'Creative Blog Post Writer',
    'Write an engaging and SEO-optimized blog post about [TOPIC]. The post should be:
- 1000-1500 words long
- Written in a conversational yet professional tone
- Include relevant keywords naturally
- Have an attention-grabbing headline
- Include subheadings for better readability
- End with a strong call-to-action

Target audience: [DESCRIBE AUDIENCE]
Writing style: [casual/formal/technical]',
    'Writing',
    ARRAY['writing', 'blogging', 'seo', 'content'],
    true,
    67,
    29,
    412
  ),
  (
    'React Component Generator',
    'Create a modern, well-structured React component with the following specifications:

Component name: [NAME]
Purpose: [DESCRIPTION]

Requirements:
- Use TypeScript for type safety
- Include proper TypeScript interfaces/types
- Follow React best practices and hooks patterns
- Add comprehensive prop validation
- Include accessibility attributes (ARIA)
- Style with Tailwind CSS
- Add helpful comments for complex logic

Make the component reusable and production-ready.',
    'Programming',
    ARRAY['react', 'typescript', 'frontend', 'components'],
    true,
    89,
    45,
    567
  ),
  (
    'Marketing Campaign Strategist',
    'Develop a comprehensive marketing campaign strategy for [PRODUCT/SERVICE]:

1. Target Audience Analysis
   - Demographics
   - Pain points
   - Motivations

2. Campaign Objectives
   - Primary goals
   - KPIs to track

3. Multi-Channel Strategy
   - Social media platforms
   - Email marketing approach
   - Content marketing plan
   - Paid advertising recommendations

4. Timeline and Budget Allocation

5. Success Metrics

Provide actionable recommendations with specific tactics.',
    'Marketing',
    ARRAY['marketing', 'strategy', 'campaigns', 'business'],
    true,
    53,
    31,
    298
  ),
  (
    'UI/UX Design Reviewer',
    'Review this design/wireframe/prototype and provide detailed feedback:

[DESCRIBE OR PASTE DESIGN DETAILS]

Analyze the following aspects:
1. Visual Hierarchy - Is the most important content emphasized?
2. User Flow - Is the navigation intuitive?
3. Accessibility - Does it meet WCAG standards?
4. Color Theory - Is the color palette effective?
5. Typography - Are fonts readable and appropriate?
6. Mobile Responsiveness - Does it work on all devices?
7. White Space - Is there proper breathing room?

Provide specific suggestions for improvement.',
    'Design',
    ARRAY['design', 'ui', 'ux', 'feedback'],
    true,
    38,
    22,
    189
  ),
  (
    'Data Analysis Expert',
    'Analyze the following dataset and provide insights:

Dataset: [DESCRIBE YOUR DATA]

Please perform:
1. Exploratory Data Analysis (EDA)
   - Summary statistics
   - Data distribution patterns
   - Outlier detection

2. Key Findings
   - Notable trends
   - Correlations
   - Anomalies

3. Visualizations Recommendations
   - Best chart types for this data
   - What to highlight

4. Actionable Insights
   - What the data tells us
   - Recommendations based on findings

Present findings in a clear, executive-friendly format.',
    'Data Analysis',
    ARRAY['data', 'analysis', 'statistics', 'insights'],
    true,
    76,
    41,
    445
  ),
  (
    'Business Plan Creator',
    'Create a comprehensive business plan for [BUSINESS IDEA]:

1. Executive Summary
2. Company Description
   - Mission statement
   - Vision
   - Core values

3. Market Analysis
   - Industry overview
   - Target market
   - Competitive analysis

4. Organization & Management
5. Products/Services Line
6. Marketing & Sales Strategy
7. Financial Projections
   - Startup costs
   - Revenue projections
   - Break-even analysis

8. Funding Requirements (if applicable)

Make it investor-ready and professional.',
    'Business',
    ARRAY['business', 'startup', 'planning', 'strategy'],
    true,
    94,
    52,
    621
  ),
  (
    'SQL Query Optimizer',
    'Optimize the following SQL query for better performance:

```sql
[YOUR SQL QUERY]
```

Please:
1. Identify performance bottlenecks
2. Suggest index improvements
3. Rewrite the query for better efficiency
4. Explain the optimizations made
5. Provide estimated performance improvement
6. Add best practices comments

Consider: table size, join types, subqueries, and database-specific features.',
    'Programming',
    ARRAY['sql', 'database', 'optimization', 'performance'],
    true,
    61,
    34,
    387
  ),
  (
    'Email Marketing Copy',
    'Write a compelling email marketing campaign for [PRODUCT/SERVICE]:

Email Type: [Welcome/Promotional/Newsletter/Cart Abandonment]

Include:
1. Attention-grabbing subject line (provide 3 options)
2. Personalized greeting
3. Engaging opening hook
4. Clear value proposition
5. Social proof or testimonials
6. Strong call-to-action
7. Mobile-friendly formatting

Tone: [Professional/Casual/Urgent/Friendly]
Length: [Short/Medium/Long]

Make it conversion-focused and spam-filter friendly.',
    'Marketing',
    ARRAY['email', 'marketing', 'copywriting', 'sales'],
    true,
    72,
    38,
    456
  ),
  (
    'Educational Content Creator',
    'Create comprehensive educational content about [TOPIC]:

Target Audience: [Students/Professionals/Beginners/Advanced]

Structure:
1. Learning Objectives
   - What students will understand by the end

2. Introduction
   - Why this topic matters
   - Real-world applications

3. Core Concepts
   - Break down complex ideas
   - Use analogies and examples
   - Include practice exercises

4. Common Mistakes to Avoid

5. Summary and Key Takeaways

6. Additional Resources for further learning

Make it engaging, easy to understand, and pedagogically sound.',
    'Education',
    ARRAY['education', 'teaching', 'learning', 'content'],
    true,
    48,
    27,
    312
  ),
  (
    'API Documentation Writer',
    'Write clear and comprehensive API documentation for [API NAME]:

Endpoint: [METHOD] [URL]

Include:
1. Overview
   - What this endpoint does
   - Use cases

2. Authentication
   - Required headers
   - API key format

3. Request Parameters
   - Path parameters
   - Query parameters
   - Request body schema

4. Response Format
   - Success response (200)
   - Error responses (400, 401, 404, 500)
   - Example JSON responses

5. Code Examples
   - cURL
   - JavaScript/Python
   - Error handling

6. Rate Limiting & Best Practices',
    'Programming',
    ARRAY['api', 'documentation', 'technical-writing'],
    true,
    55,
    32,
    378
  ),
  (
    'Social Media Content Calendar',
    'Create a 30-day social media content calendar for [BRAND/BUSINESS]:

Platform: [Instagram/Twitter/LinkedIn/Facebook/TikTok]

For each post include:
- Date and optimal posting time
- Post type (image/video/carousel/story)
- Caption with hashtags
- Content theme/category
- Call-to-action
- Target audience segment

Content pillars:
- Educational (40%)
- Entertaining (30%)
- Promotional (20%)
- Community/Engagement (10%)

Ensure content variety and consistent brand voice.',
    'Marketing',
    ARRAY['social-media', 'content', 'planning', 'marketing'],
    true,
    81,
    47,
    523
  )
) AS sample_data(title, content, category_name, tags, is_public, likes_count, favorites_count, views_count);

-- Verify the data was inserted
SELECT COUNT(*) as total_prompts FROM prompts;
