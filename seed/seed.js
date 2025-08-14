import mongoose from 'mongoose';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Skill.deleteMany({});

  // Create Different Users
  const users = [
    { username: 'jack', email: 'jack@example.com', password: 'Jack@123456', contact: 'jack@example.com' },
    { username: 'jane', email: 'jane@example.com', password: 'Jane@123456', contact: '+1 555-1234' },
    { username: 'mike', email: 'mike@example.com', password: 'Mike@123456', contact: 'mike_skiller@twitter.com' },
    { username: 'sarah', email: 'sarah@example.com', password: 'Sarah@123456', contact: 'https://sarahportfolio.com' },
    { username: 'david', email: 'david@example.com', password: 'David@123456', contact: 'david.dev#1234' },
  ];

  const savedUsers = [];
  for (const userData of users) {
    const hashed = await bcrypt.hash(userData.password, 10);
    const user = new User({
      username: userData.username,
      password: hashed,
      email: userData.email,
      contact: userData.contact,
    });
    savedUsers.push(await user.save());
  }

  // Skill categories and corresponding skills pool
  const skillPool = {
    'Languages & Translation': [
      'English to Chinese Translation',
      'Spanish Conversation Practice',
      'French Writing and Grammar',
      'Japanese Business Communication',
      'German Pronunciation Coaching',
      'Korean Language Basics',
    ],
    'Academics & Tutoring': [
      'High School Math Tutoring',
      'Physics Problem Solving',
      'Chemistry Lab Techniques',
      'Essay Writing Assistance',
      'SAT Test Preparation',
      'History Discussion and Analysis',
    ],
    'Programming & Technology': [
      'Full Stack Web Development',
      'Python Data Analysis',
      'Mobile App Development',
      'Machine Learning Basics',
      'Cybersecurity Fundamentals',
      'Cloud Computing with AWS',
    ],
    'Design & Creativity': [
      'Logo Design',
      'UI/UX Wireframing',
      'Adobe Photoshop Editing',
      '3D Modeling with Blender',
      'Creative Illustration',
      'Photography Basics',
    ],
    'Music, Performing Arts & Writing': [
      'Guitar Lessons',
      'Creative Writing Coaching',
      'Piano for Beginners',
      'Acting Techniques',
      'Songwriting',
      'Dance Choreography',
    ],
    'Business, Marketing & Management': [
      'Social Media Strategy',
      'Project Management',
      'Business Plan Writing',
      'SEO Optimization',
      'Financial Analysis',
      'Customer Service Training',
    ],
    'Cooking & Culinary Arts': [
      'Italian Pasta Making',
      'Healthy Meal Prep',
      'Baking Bread from Scratch',
      'Sushi Rolling Techniques',
      'Vegetarian Cooking',
      'Grilling and BBQ',
    ],
    'Fitness, Sports & Wellness': [
      'Yoga for Beginners',
      'Strength Training Coaching',
      'Marathon Training Plan',
      'Meditation Guidance',
      'Pilates Basics',
      'Nutrition Advice',
    ],
    'Lifestyle, Travel & Outdoor Activities': [
      'Backpacking Tips',
      'Photography for Travel',
      'Camping Essentials',
      'Urban Gardening',
      'Surfing Basics',
      'Cycling Safety',
    ],
    'Finance & Investment': [
      'Personal Budget Planning',
      'Stock Market Basics',
      'Cryptocurrency Introduction',
      'Retirement Planning',
      'Tax Preparation',
      'Real Estate Investment',
    ],
    'Other': [
      'DIY Home Repairs',
      'Public Speaking Skills',
      'Time Management Coaching',
      'Creative Problem Solving',
      'Mindfulness Practice',
      'Pet Training Basics',
    ],
  };

  const prefixes = [
    'I can teach',
    'Expert in',
    'Proficient in',
    'Skilled at',
    'Offering lessons in',
    'Passionate about teaching',
    'Available for tutoring in',
    'Experienced with',
    'Can help with',
    'Specializing in',
  ];

  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Generate Random Date
  function getRandomDate() {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    const randomTime = threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime());
    return new Date(randomTime);
  }

  
  const descriptionTemplates = [
    '{title} with {years} years of experience. I specialize in {specificArea}.',
    'Offering comprehensive lessons on {skillName}. From beginners to advanced levels.',
    'Passionate about {skillName} and have helped over {students} students improve their skills.',
    'Providing practical tips and expert advice in {skillName}. Learn from real-world examples.',
    'Helping beginners master the fundamentals of {skillName} in a fun and engaging way.',
    'Focused on sharing industry secrets and best practices for {skillName}.',
  ];

  
  const specificAreas = {
    'Languages & Translation': ['technical translation', 'literary translation', 'business communication'],
    'Academics & Tutoring': ['exam preparation', 'conceptual understanding', 'homework help'],
    'Programming & Technology': ['web development', 'mobile apps', 'data analysis'],
    'Design & Creativity': ['user experience', 'branding', 'digital illustration'],
    'Music, Performing Arts & Writing': ['composition', 'performance techniques', 'songwriting'],
    'Business, Marketing & Management': ['social media', 'content marketing', 'project management'],
    'Cooking & Culinary Arts': ['pastry making', 'sous vide', 'flavor pairing'],
    'Fitness, Sports & Wellness': ['strength training', 'flexibility', 'mental resilience'],
    'Lifestyle, Travel & Outdoor Activities': ['budget travel', 'wildlife photography', 'survival skills'],
    'Finance & Investment': ['stock trading', 'real estate', 'personal budgeting'],
    'Other': ['public speaking', 'productivity', 'mindfulness']
  };

  const skills = [];
  while (skills.length < 50) {
    const categories = Object.keys(skillPool);
    const category = getRandom(categories);
    const skillName = getRandom(skillPool[category]);
    const prefix = getRandom(prefixes);
    const user = getRandom(savedUsers);
    const createdAt = getRandomDate();
    const years = Math.floor(Math.random() * 10) + 1; 
    const students = Math.floor(Math.random() * 500) + 10; 
    const specificArea = getRandom(specificAreas[category]);
    
    // Create grammatically correct title
    let title;
    if (prefix.endsWith('in') || prefix.endsWith('at') || prefix.endsWith('with')) {
      title = `${prefix} ${skillName}`;
    } else if (prefix.includes('teach') || prefix.includes('lessons') || prefix.includes('tutoring')) {
      // For verbs like teach, use the gerund form if needed
      if (skillName.endsWith('ing')) {
        title = `${prefix} ${skillName}`;
      } else {
        // Convert skill name to gerund form if it's a noun
        title = `${prefix} ${skillName.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase())}`;
      }
    } else {
      title = `${prefix} ${skillName}`;
    }
    
    
    let description = getRandom(descriptionTemplates);
    description = description
      .replace('{title}', title)
      .replace('{years}', years)
      .replace('{specificArea}', specificArea)
      .replace('{skillName}', skillName.toLowerCase())
      .replace('{students}', students);

    if (!skills.find(s => s.title === title)) {
      skills.push({
        title,
        category,
        description,
        postedBy: user._id,
        createdAt: createdAt,  
      });
    }
  }

  await Skill.insertMany(skills);

  console.log(`✅ Successfully imported ${savedUsers.length} users and ${skills.length} skill records`);
  process.exit();
}

seed();
