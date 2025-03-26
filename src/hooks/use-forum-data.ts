
import { Topic } from './use-forum';

interface SampleTopic extends Omit<Topic, 'id' | 'createdAt' | 'commentsCount'> {
  id?: string;
  createdAt?: string;
  commentsCount?: number;
}

// Sample users IDs to use in topics
const sampleUserIds = [
  'user1', 'user2', 'user3', 'user4', 'user5',
  'user6', 'user7', 'user8', 'user9', 'user10'
];

// Generate sample topics
export const generateSampleTopics = (): Topic[] => {
  const sampleTopics: SampleTopic[] = [
    // Games - English
    {
      title: "The Last of Us Part II: A Masterpiece or Overrated?",
      content: "I just finished The Last of Us Part II and I'm not sure how to feel about it. The gameplay was amazing but the story was quite divisive. What are your thoughts on this game?",
      category: "games",
      tags: ["TLOU2", "PS4", "Naughty Dog"],
      username: "EliteGamer",
      userId: sampleUserIds[0],
      likes: [sampleUserIds[1], sampleUserIds[2], sampleUserIds[3]],
    },
    {
      title: "Most anticipated games of 2023?",
      content: "With so many amazing games coming out this year, which ones are you most excited about? I'm personally looking forward to Starfield and Hogwarts Legacy!",
      category: "games",
      tags: ["2023", "Upcoming", "AAA"],
      username: "GameEnthusiast",
      userId: sampleUserIds[1],
      likes: [sampleUserIds[0], sampleUserIds[2]],
    },
    
    // Games - Russian
    {
      title: "Elden Ring: Сложность как недостаток или преимущество?",
      content: "Недавно начал играть в Elden Ring и был поражен уровнем сложности. Считаете ли вы, что высокая сложность делает игру лучше или отпугивает новых игроков?",
      category: "games",
      tags: ["Elden Ring", "FromSoftware", "Соулслайк"],
      username: "ДревнийГеймер",
      userId: sampleUserIds[2],
      likes: [sampleUserIds[0], sampleUserIds[3], sampleUserIds[4], sampleUserIds[5]],
    },
    {
      title: "Лучшие инди-игры 2022 года",
      content: "Поделитесь своими любимыми инди-играми, вышедшими в 2022 году. Я открыл для себя Stray и Cult of the Lamb - обе просто потрясающие!",
      category: "games",
      tags: ["Инди", "2022", "Stray"],
      username: "ИндиЛюбитель",
      userId: sampleUserIds[3],
      likes: [sampleUserIds[1]],
    },
    
    // Industry - English
    {
      title: "Microsoft's acquisition of Activision Blizzard - Good or bad for gaming?",
      content: "With Microsoft buying Activision Blizzard for nearly $70 billion, how do you think this will impact the gaming industry? Will we see more exclusives or better games overall?",
      category: "industry",
      tags: ["Microsoft", "Activision", "Acquisition"],
      username: "IndustryAnalyst",
      userId: sampleUserIds[4],
      likes: [sampleUserIds[0], sampleUserIds[2], sampleUserIds[6]],
    },
    {
      title: "The growth of cloud gaming services",
      content: "Cloud gaming seems to be becoming more popular with services like Xbox Cloud Gaming and GeForce Now. Have you tried any cloud gaming services and what was your experience?",
      category: "industry",
      tags: ["Cloud Gaming", "Xbox", "GeForce Now"],
      username: "TechGamer",
      userId: sampleUserIds[5],
      likes: [sampleUserIds[4]],
    },
    
    // Industry - Russian
    {
      title: "Влияние санкций на игровую индустрию в России",
      content: "Как вы считаете, какое долгосрочное влияние окажут международные санкции на разработку игр в России? Есть ли у отечественных разработчиков шанс на мировой успех в текущих условиях?",
      category: "industry",
      tags: ["Санкции", "Разработка", "Россия"],
      username: "ТехноАналитик",
      userId: sampleUserIds[6],
      likes: [sampleUserIds[7], sampleUserIds[8]],
    },
    {
      title: "Перспективы VR технологий в 2023 году",
      content: "Meta Quest продолжает доминировать на рынке VR, но Sony выпускает PS VR2. Как вы думаете, станет ли 2023 переломным годом для виртуальной реальности?",
      category: "industry",
      tags: ["VR", "Meta Quest", "PSVR"],
      username: "ВиртуальныйГеймер",
      userId: sampleUserIds[7],
      likes: [sampleUserIds[6], sampleUserIds[9]],
    },
    
    // Offtopic - English
    {
      title: "Best gaming setups - Share yours!",
      content: "I recently upgraded my gaming setup with a new desk and monitor. I'd love to see your setups and get some inspiration for further improvements!",
      category: "offtopic",
      tags: ["Setup", "Battlestation", "Gaming Desk"],
      username: "SetupKing",
      userId: sampleUserIds[8],
      likes: [sampleUserIds[1], sampleUserIds[3], sampleUserIds[5]],
    },
    {
      title: "Favorite gaming snacks?",
      content: "I'm curious what everyone's go-to gaming snacks are! I personally can't game without some chips and energy drinks. What about you?",
      category: "offtopic",
      tags: ["Food", "Snacks", "Off-topic"],
      username: "SnackAttack",
      userId: sampleUserIds[9],
      likes: [sampleUserIds[0], sampleUserIds[2]],
    },
    
    // Offtopic - Russian
    {
      title: "Любимые фильмы по мотивам видеоигр",
      content: "Недавно посмотрел новый фильм по Uncharted и он мне на удивление понравился. Какие адаптации видеоигр вы считаете самыми удачными, а какие провальными?",
      category: "offtopic",
      tags: ["Фильмы", "Адаптации", "Uncharted"],
      username: "КиноГеймер",
      userId: sampleUserIds[0],
      likes: [sampleUserIds[5], sampleUserIds[9]],
    },
    {
      title: "Как сохранять здоровье при длительных игровых сессиях?",
      content: "После нескольких часов игры у меня часто болит спина и глаза устают. Какие у вас есть советы по сохранению здоровья во время длительных игровых сессий?",
      category: "offtopic",
      tags: ["Здоровье", "Эргономика", "Советы"],
      username: "ЗдоровыйГеймер",
      userId: sampleUserIds[3],
      likes: [sampleUserIds[1], sampleUserIds[6], sampleUserIds[8]],
    }
  ];
  
  // Add timestamps, ids, and comment counts
  const topics = sampleTopics.map((topic, index): Topic => {
    // Create a date between 1-30 days ago
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    return {
      ...topic,
      id: `sample-${index + 1}`,
      createdAt: date.toISOString(),
      commentsCount: Math.floor(Math.random() * 15), // Random comment count between 0-15
    };
  });
  
  return topics;
};

// Generate sample users
export const generateSampleUsers = () => {
  return [
    { id: sampleUserIds[0], username: 'EliteGamer', email: 'elite@example.com', password: 'password123', registeredAt: '2022-01-05T10:00:00Z', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: sampleUserIds[1], username: 'GameEnthusiast', email: 'enthusiast@example.com', password: 'password123', registeredAt: '2022-02-14T14:30:00Z', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: sampleUserIds[2], username: 'ДревнийГеймер', email: 'ancient@example.com', password: 'password123', registeredAt: '2022-03-22T09:15:00Z', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: sampleUserIds[3], username: 'ИндиЛюбитель', email: 'indie@example.com', password: 'password123', registeredAt: '2022-04-18T16:45:00Z', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: sampleUserIds[4], username: 'IndustryAnalyst', email: 'analyst@example.com', password: 'password123', registeredAt: '2022-05-07T11:20:00Z', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: sampleUserIds[5], username: 'TechGamer', email: 'tech@example.com', password: 'password123', registeredAt: '2022-06-30T08:10:00Z', avatar: 'https://i.pravatar.cc/150?img=6' },
    { id: sampleUserIds[6], username: 'ТехноАналитик', email: 'techanalyst@example.com', password: 'password123', registeredAt: '2022-07-12T13:40:00Z', avatar: 'https://i.pravatar.cc/150?img=7' },
    { id: sampleUserIds[7], username: 'ВиртуальныйГеймер', email: 'virtual@example.com', password: 'password123', registeredAt: '2022-08-25T15:30:00Z', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: sampleUserIds[8], username: 'SetupKing', email: 'setup@example.com', password: 'password123', registeredAt: '2022-09-09T10:50:00Z', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: sampleUserIds[9], username: 'SnackAttack', email: 'snack@example.com', password: 'password123', registeredAt: '2022-10-17T12:25:00Z', avatar: 'https://i.pravatar.cc/150?img=10' },
  ];
};

// Generate sample comments
export const generateSampleComments = (topics: Topic[]) => {
  const comments = [];
  const userIds = sampleUserIds;

  // For each topic, generate 1-5 comments
  for (const topic of topics) {
    const commentCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < commentCount; i++) {
      // Pick a random user as the author of the comment
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const username = generateSampleUsers().find(u => u.id === userId)?.username || 'Anonymous';
      
      // Create a date between the topic creation date and now
      const topicDate = new Date(topic.createdAt);
      const now = new Date();
      const randomTimeOffset = Math.random() * (now.getTime() - topicDate.getTime());
      const commentDate = new Date(topicDate.getTime() + randomTimeOffset);
      
      // Generate English or Russian comment based on username
      const isRussianUser = /[А-я]/.test(username);
      
      let content = '';
      if (isRussianUser) {
        const russianContents = [
          "Отличная тема для обсуждения, спасибо за пост!",
          "Я согласен с автором, действительно интересная точка зрения.",
          "Хмм, не уверен, что соглашусь. Мой опыт совершенно другой.",
          "А вы пробовали смотреть на эту проблему с другой стороны?",
          "Отличный анализ ситуации, многое стало понятнее."
        ];
        content = russianContents[Math.floor(Math.random() * russianContents.length)];
      } else {
        const englishContents = [
          "Great topic for discussion, thanks for posting!",
          "I agree with the author, really interesting perspective.",
          "Hmm, not sure I agree. My experience has been quite different.",
          "Have you tried looking at this issue from another angle?",
          "Excellent analysis of the situation, makes a lot more sense now."
        ];
        content = englishContents[Math.floor(Math.random() * englishContents.length)];
      }
      
      comments.push({
        id: `comment-${topic.id}-${i}`,
        topicId: topic.id,
        userId,
        username,
        content,
        createdAt: commentDate.toISOString(),
        likes: []
      });
    }
  }
  
  return comments;
};
