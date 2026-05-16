export type Language = 'chinese' | 'japanese' | 'english' | 'spanish';
export type Category = 'daily' | 'travel' | 'business';

export interface Phrase {
  id: number;
  text: string;
  translation: string;
  pronunciation: string;
  category: Category;
  level: number;
}

const targetPhraseCount = 300;

const basePhrasesData: Record<Language, Phrase[]> = {
  english: [
    { id: 1, text: 'Hello', translation: '안녕하세요', pronunciation: 'hello', category: 'daily', level: 1 },
    { id: 2, text: 'Thank you', translation: '감사합니다', pronunciation: 'thank you', category: 'daily', level: 1 },
    { id: 3, text: 'Good morning', translation: '좋은 아침입니다', pronunciation: 'good morning', category: 'daily', level: 1 },
    { id: 4, text: 'How are you?', translation: '어떻게 지내세요?', pronunciation: 'how are you', category: 'daily', level: 2 },
    { id: 5, text: 'I need some help', translation: '도움이 필요해요', pronunciation: 'I need some help', category: 'daily', level: 3 },
    { id: 13, text: 'I usually take a walk after dinner', translation: '저는 보통 저녁 식사 후 산책해요', pronunciation: 'I usually take a walk after dinner', category: 'daily', level: 4 },
    { id: 14, text: 'I have been learning English little by little', translation: '저는 영어를 조금씩 배워오고 있어요', pronunciation: 'I have been learning English little by little', category: 'daily', level: 5 },
    { id: 6, text: 'Where is the bathroom?', translation: '화장실이 어디에요?', pronunciation: 'where is the bathroom', category: 'travel', level: 1 },
    { id: 7, text: 'How much is this?', translation: '이거 얼마예요?', pronunciation: 'how much is this', category: 'travel', level: 1 },
    { id: 8, text: 'Can you recommend a restaurant?', translation: '식당 추천해주실 수 있나요?', pronunciation: 'can you recommend a restaurant', category: 'travel', level: 2 },
    { id: 9, text: 'I would like to book a hotel room', translation: '호텔 방을 예약하고 싶어요', pronunciation: 'I would like to book a hotel room', category: 'travel', level: 3 },
    { id: 15, text: 'Could you tell me the fastest way to the station?', translation: '역까지 가장 빠른 길을 알려주시겠어요?', pronunciation: 'Could you tell me the fastest way to the station', category: 'travel', level: 4 },
    { id: 16, text: 'My flight was delayed because of the weather', translation: '날씨 때문에 제 비행기가 지연됐어요', pronunciation: 'My flight was delayed because of the weather', category: 'travel', level: 5 },
    { id: 18, text: 'Yes', translation: '네', pronunciation: 'yes', category: 'daily', level: 1 },
    { id: 19, text: 'No', translation: '아니요', pronunciation: 'no', category: 'daily', level: 1 },
    { id: 20, text: 'Excuse me', translation: '실례합니다', pronunciation: 'excuse me', category: 'daily', level: 1 },
    { id: 21, text: 'I am sorry', translation: '미안합니다', pronunciation: 'I am sorry', category: 'daily', level: 1 },
    { id: 22, text: 'Please', translation: '부탁합니다', pronunciation: 'please', category: 'daily', level: 1 },
    { id: 10, text: 'Nice to meet you', translation: '만나서 반갑습니다', pronunciation: 'nice to meet you', category: 'business', level: 2 },
    { id: 11, text: 'I have a meeting at 3 PM', translation: '오후 3시에 회의가 있어요', pronunciation: 'I have a meeting at 3 PM', category: 'business', level: 3 },
    { id: 12, text: 'Could you send me the report?', translation: '보고서를 보내주시겠어요?', pronunciation: 'could you send me the report', category: 'business', level: 4 },
    { id: 17, text: 'Let us review the proposal before lunch', translation: '점심 전에 제안서를 검토합시다', pronunciation: 'Let us review the proposal before lunch', category: 'business', level: 5 },
  ],
  chinese: [
    { id: 1, text: '你好', translation: '안녕하세요', pronunciation: 'nǐ hǎo', category: 'daily', level: 1 },
    { id: 2, text: '谢谢', translation: '감사합니다', pronunciation: 'xiè xie', category: 'daily', level: 1 },
    { id: 3, text: '早上好', translation: '좋은 아침입니다', pronunciation: 'zǎo shang hǎo', category: 'daily', level: 1 },
    { id: 4, text: '你好吗？', translation: '잘 지내세요?', pronunciation: 'nǐ hǎo ma', category: 'daily', level: 2 },
    { id: 5, text: '我需要帮助', translation: '도움이 필요해요', pronunciation: 'wǒ xū yào bāng zhù', category: 'daily', level: 3 },
    { id: 13, text: '我通常晚饭后散步', translation: '저는 보통 저녁 식사 후 산책해요', pronunciation: 'wǒ tōng cháng wǎn fàn hòu sàn bù', category: 'daily', level: 4 },
    { id: 14, text: '我一直一点一点地学中文', translation: '저는 중국어를 조금씩 배워오고 있어요', pronunciation: 'wǒ yì zhí yì diǎn yì diǎn de xué zhōng wén', category: 'daily', level: 5 },
    { id: 6, text: '洗手间在哪里？', translation: '화장실이 어디에요?', pronunciation: 'xǐ shǒu jiān zài nǎ lǐ', category: 'travel', level: 1 },
    { id: 7, text: '这个多少钱？', translation: '이거 얼마예요?', pronunciation: 'zhè ge duō shǎo qián', category: 'travel', level: 1 },
    { id: 8, text: '你能推荐一家餐厅吗？', translation: '식당 추천해주실 수 있나요?', pronunciation: 'nǐ néng tuī jiàn yī jiā cān tīng ma', category: 'travel', level: 2 },
    { id: 9, text: '我想预订酒店房间', translation: '호텔 방을 예약하고 싶어요', pronunciation: 'wǒ xiǎng yù dìng jiǔ diàn fáng jiān', category: 'travel', level: 3 },
    { id: 15, text: '你能告诉我去车站最快的路吗？', translation: '역까지 가장 빠른 길을 알려주시겠어요?', pronunciation: 'nǐ néng gào sù wǒ qù chē zhàn zuì kuài de lù ma', category: 'travel', level: 4 },
    { id: 16, text: '我的航班因为天气延误了', translation: '날씨 때문에 제 비행기가 지연됐어요', pronunciation: 'wǒ de háng bān yīn wèi tiān qì yán wù le', category: 'travel', level: 5 },
    { id: 18, text: '是', translation: '네', pronunciation: 'shì', category: 'daily', level: 1 },
    { id: 19, text: '不是', translation: '아니요', pronunciation: 'bú shì', category: 'daily', level: 1 },
    { id: 20, text: '不好意思', translation: '실례합니다', pronunciation: 'bù hǎo yì si', category: 'daily', level: 1 },
    { id: 21, text: '对不起', translation: '미안합니다', pronunciation: 'duì bu qǐ', category: 'daily', level: 1 },
    { id: 22, text: '请', translation: '부탁합니다', pronunciation: 'qǐng', category: 'daily', level: 1 },
    { id: 10, text: '很高兴认识你', translation: '만나서 반갑습니다', pronunciation: 'hěn gāo xìng rèn shi nǐ', category: 'business', level: 2 },
    { id: 11, text: '我下午三点有会议', translation: '오후 3시에 회의가 있어요', pronunciation: 'wǒ xià wǔ sān diǎn yǒu huì yì', category: 'business', level: 3 },
    { id: 12, text: '你能把报告发给我吗？', translation: '보고서를 보내주시겠어요?', pronunciation: 'nǐ néng bǎ bào gào fā gěi wǒ ma', category: 'business', level: 4 },
    { id: 17, text: '我们午饭前看一下提案吧', translation: '점심 전에 제안서를 검토합시다', pronunciation: 'wǒ men wǔ fàn qián kàn yí xià tí àn ba', category: 'business', level: 5 },
  ],
  japanese: [
    { id: 1, text: 'こんにちは', translation: '안녕하세요', pronunciation: 'konnichiwa', category: 'daily', level: 1 },
    { id: 2, text: 'ありがとう', translation: '감사합니다', pronunciation: 'arigatō', category: 'daily', level: 1 },
    { id: 3, text: 'おはよう', translation: '좋은 아침입니다', pronunciation: 'ohayō', category: 'daily', level: 1 },
    { id: 4, text: '元気ですか？', translation: '잘 지내세요?', pronunciation: 'genki desu ka', category: 'daily', level: 2 },
    { id: 5, text: '助けが必要です', translation: '도움이 필요해요', pronunciation: 'tasuke ga hitsuyō desu', category: 'daily', level: 3 },
    { id: 13, text: '夕食後によく散歩します', translation: '저는 보통 저녁 식사 후 산책해요', pronunciation: 'yuushokugo ni yoku sanpo shimasu', category: 'daily', level: 4 },
    { id: 14, text: '日本語を少しずつ勉強してきました', translation: '저는 일본어를 조금씩 배워오고 있어요', pronunciation: 'nihongo wo sukoshi zutsu benkyou shite kimashita', category: 'daily', level: 5 },
    { id: 6, text: 'トイレはどこですか？', translation: '화장실이 어디에요?', pronunciation: 'toire wa doko desu ka', category: 'travel', level: 1 },
    { id: 7, text: 'これはいくらですか？', translation: '이거 얼마예요?', pronunciation: 'kore wa ikura desu ka', category: 'travel', level: 1 },
    { id: 8, text: 'レストランをおすすめできますか？', translation: '식당 추천해주실 수 있나요?', pronunciation: 'resutoran wo osusume dekimasu ka', category: 'travel', level: 2 },
    { id: 9, text: 'ホテルの部屋を予約したいです', translation: '호텔 방을 예약하고 싶어요', pronunciation: 'hoteru no heya wo yoyaku shitai desu', category: 'travel', level: 3 },
    { id: 15, text: '駅まで一番早い行き方を教えていただけますか？', translation: '역까지 가장 빠른 길을 알려주시겠어요?', pronunciation: 'eki made ichiban hayai ikikata wo oshiete itadakemasu ka', category: 'travel', level: 4 },
    { id: 16, text: '天気のために飛行機が遅れました', translation: '날씨 때문에 제 비행기가 지연됐어요', pronunciation: 'tenki no tame ni hikouki ga okuremashita', category: 'travel', level: 5 },
    { id: 18, text: 'はい', translation: '네', pronunciation: 'hai', category: 'daily', level: 1 },
    { id: 19, text: 'いいえ', translation: '아니요', pronunciation: 'iie', category: 'daily', level: 1 },
    { id: 20, text: 'すみません', translation: '실례합니다', pronunciation: 'sumimasen', category: 'daily', level: 1 },
    { id: 21, text: 'ごめんなさい', translation: '미안합니다', pronunciation: 'gomennasai', category: 'daily', level: 1 },
    { id: 22, text: 'お願いします', translation: '부탁합니다', pronunciation: 'onegai shimasu', category: 'daily', level: 1 },
    { id: 10, text: 'お会いできて嬉しいです', translation: '만나서 반갑습니다', pronunciation: 'oai dekite ureshii desu', category: 'business', level: 2 },
    { id: 11, text: '午後3時に会議があります', translation: '오후 3시에 회의가 있어요', pronunciation: 'gogo san-ji ni kaigi ga arimasu', category: 'business', level: 3 },
    { id: 12, text: 'レポートを送っていただけますか？', translation: '보고서를 보내주시겠어요?', pronunciation: 'repōto wo okutte itadakemasu ka', category: 'business', level: 4 },
    { id: 17, text: '昼食前に提案書を確認しましょう', translation: '점심 전에 제안서를 검토합시다', pronunciation: 'chuushoku mae ni teiansho wo kakunin shimashou', category: 'business', level: 5 },
  ],
  spanish: [
    { id: 1, text: 'Hola', translation: '안녕하세요', pronunciation: 'ola', category: 'daily', level: 1 },
    { id: 2, text: 'Gracias', translation: '감사합니다', pronunciation: 'grasias', category: 'daily', level: 1 },
    { id: 3, text: 'Buenos días', translation: '좋은 아침입니다', pronunciation: 'buenos días', category: 'daily', level: 1 },
    { id: 4, text: '¿Cómo estás?', translation: '잘 지내세요?', pronunciation: 'komo estas', category: 'daily', level: 2 },
    { id: 5, text: 'Necesito ayuda', translation: '도움이 필요해요', pronunciation: 'necesito ayuda', category: 'daily', level: 3 },
    { id: 13, text: 'Normalmente camino después de cenar', translation: '저는 보통 저녁 식사 후 산책해요', pronunciation: 'normalmente kamino despues de senar', category: 'daily', level: 4 },
    { id: 14, text: 'He estado aprendiendo español poco a poco', translation: '저는 스페인어를 조금씩 배워오고 있어요', pronunciation: 'e estado aprendiendo espanyol poko a poko', category: 'daily', level: 5 },
    { id: 6, text: '¿Dónde está el baño?', translation: '화장실이 어디에요?', pronunciation: 'donde esta el baño', category: 'travel', level: 1 },
    { id: 7, text: '¿Cuánto cuesta esto?', translation: '이거 얼마예요?', pronunciation: 'kuanto kuesta esto', category: 'travel', level: 1 },
    { id: 8, text: '¿Puedes recomendar un restaurante?', translation: '식당 추천해주실 수 있나요?', pronunciation: 'puedes rekomendar un restaurante', category: 'travel', level: 2 },
    { id: 9, text: 'Quisiera reservar una habitación', translation: '호텔 방을 예약하고 싶어요', pronunciation: 'kisiera reservar una abitasion', category: 'travel', level: 3 },
    { id: 15, text: '¿Podrías decirme la forma más rápida de llegar a la estación?', translation: '역까지 가장 빠른 길을 알려주시겠어요?', pronunciation: 'podrias desir-me la forma mas rapida de llegar a la estasion', category: 'travel', level: 4 },
    { id: 16, text: 'Mi vuelo se retrasó por el clima', translation: '날씨 때문에 제 비행기가 지연됐어요', pronunciation: 'mi vuelo se retraso por el klima', category: 'travel', level: 5 },
    { id: 18, text: 'Sí', translation: '네', pronunciation: 'si', category: 'daily', level: 1 },
    { id: 19, text: 'No', translation: '아니요', pronunciation: 'no', category: 'daily', level: 1 },
    { id: 20, text: 'Perdón', translation: '실례합니다', pronunciation: 'perdon', category: 'daily', level: 1 },
    { id: 21, text: 'Lo siento', translation: '미안합니다', pronunciation: 'lo siento', category: 'daily', level: 1 },
    { id: 22, text: 'Por favor', translation: '부탁합니다', pronunciation: 'por favor', category: 'daily', level: 1 },
    { id: 10, text: 'Encantado de conocerte', translation: '만나서 반갑습니다', pronunciation: 'enkantado de konoserte', category: 'business', level: 2 },
    { id: 11, text: 'Tengo una reunión a las 3 PM', translation: '오후 3시에 회의가 있어요', pronunciation: 'tengo una reunion a las tres PM', category: 'business', level: 3 },
    { id: 12, text: '¿Podrías enviarme el informe?', translation: '보고서를 보내주시겠어요?', pronunciation: 'podrias enbiarme el informe', category: 'business', level: 4 },
    { id: 17, text: 'Revisemos la propuesta antes del almuerzo', translation: '점심 전에 제안서를 검토합시다', pronunciation: 'rebisemos la propuesta antes del almuerzo', category: 'business', level: 5 },
  ],
};

type PhraseParts = Record<Language, string>;
type GeneratedCategory = Exclude<Category, never>;

interface GeneratedAction {
  category: GeneratedCategory;
  text: PhraseParts;
  pronunciation: PhraseParts;
  translation: string;
}

interface GeneratedContext {
  category: GeneratedCategory;
  text: PhraseParts;
  pronunciation: PhraseParts;
  translation: string;
}

const dailyActions: GeneratedAction[] = [
  {
    category: 'daily',
    text: { english: 'drink water', chinese: '喝水', japanese: '水を飲みます', spanish: 'bebo agua' },
    pronunciation: { english: 'drink water', chinese: 'hē shuǐ', japanese: 'mizu wo nomimasu', spanish: 'bebo agua' },
    translation: '물을 마셔요',
  },
  {
    category: 'daily',
    text: { english: 'eat breakfast', chinese: '吃早饭', japanese: '朝ごはんを食べます', spanish: 'desayuno' },
    pronunciation: { english: 'eat breakfast', chinese: 'chī zǎo fàn', japanese: 'asagohan wo tabemasu', spanish: 'desayuno' },
    translation: '아침을 먹어요',
  },
  {
    category: 'daily',
    text: { english: 'read a book', chinese: '看书', japanese: '本を読みます', spanish: 'leo un libro' },
    pronunciation: { english: 'read a book', chinese: 'kàn shū', japanese: 'hon wo yomimasu', spanish: 'leo un libro' },
    translation: '책을 읽어요',
  },
  {
    category: 'daily',
    text: { english: 'clean my room', chinese: '打扫房间', japanese: '部屋を掃除します', spanish: 'limpio mi habitación' },
    pronunciation: { english: 'clean my room', chinese: 'dǎ sǎo fáng jiān', japanese: 'heya wo souji shimasu', spanish: 'limpio mi abitasion' },
    translation: '방을 청소해요',
  },
  {
    category: 'daily',
    text: { english: 'call my friend', chinese: '给朋友打电话', japanese: '友達に電話します', spanish: 'llamo a mi amigo' },
    pronunciation: { english: 'call my friend', chinese: 'gěi péng you dǎ diàn huà', japanese: 'tomodachi ni denwa shimasu', spanish: 'llamo a mi amigo' },
    translation: '친구에게 전화해요',
  },
  {
    category: 'daily',
    text: { english: 'study vocabulary', chinese: '学习单词', japanese: '単語を勉強します', spanish: 'estudio vocabulario' },
    pronunciation: { english: 'study vocabulary', chinese: 'xué xí dān cí', japanese: 'tango wo benkyou shimasu', spanish: 'estudio bokabulario' },
    translation: '단어를 공부해요',
  },
  {
    category: 'daily',
    text: { english: 'listen to music', chinese: '听音乐', japanese: '音楽を聞きます', spanish: 'escucho música' },
    pronunciation: { english: 'listen to music', chinese: 'tīng yīn yuè', japanese: 'ongaku wo kikimasu', spanish: 'eskucho musika' },
    translation: '음악을 들어요',
  },
  {
    category: 'daily',
    text: { english: 'write a diary', chinese: '写日记', japanese: '日記を書きます', spanish: 'escribo un diario' },
    pronunciation: { english: 'write a diary', chinese: 'xiě rì jì', japanese: 'nikki wo kakimasu', spanish: 'eskribo un diario' },
    translation: '일기를 써요',
  },
  {
    category: 'daily',
    text: { english: 'cook dinner', chinese: '做晚饭', japanese: '夕食を作ります', spanish: 'preparo la cena' },
    pronunciation: { english: 'cook dinner', chinese: 'zuò wǎn fàn', japanese: 'yuushoku wo tsukurimasu', spanish: 'preparo la sena' },
    translation: '저녁을 준비해요',
  },
  {
    category: 'daily',
    text: { english: 'check the weather', chinese: '查看天气', japanese: '天気を確認します', spanish: 'reviso el clima' },
    pronunciation: { english: 'check the weather', chinese: 'chá kàn tiān qì', japanese: 'tenki wo kakunin shimasu', spanish: 'rebiso el klima' },
    translation: '날씨를 확인해요',
  },
];

const travelActions: GeneratedAction[] = [
  {
    category: 'travel',
    text: { english: 'find the gate', chinese: '找登机口', japanese: '搭乗口を探します', spanish: 'encuentro la puerta' },
    pronunciation: { english: 'find the gate', chinese: 'zhǎo dēng jī kǒu', japanese: 'toujouguchi wo sagashimasu', spanish: 'enkuentro la puerta' },
    translation: '탑승구를 찾아요',
  },
  {
    category: 'travel',
    text: { english: 'buy a ticket', chinese: '买票', japanese: 'チケットを買います', spanish: 'compro un boleto' },
    pronunciation: { english: 'buy a ticket', chinese: 'mǎi piào', japanese: 'chiketto wo kaimasu', spanish: 'kompro un boleto' },
    translation: '표를 사요',
  },
  {
    category: 'travel',
    text: { english: 'check the map', chinese: '看地图', japanese: '地図を確認します', spanish: 'reviso el mapa' },
    pronunciation: { english: 'check the map', chinese: 'kàn dì tú', japanese: 'chizu wo kakunin shimasu', spanish: 'rebiso el mapa' },
    translation: '지도를 확인해요',
  },
  {
    category: 'travel',
    text: { english: 'call a taxi', chinese: '叫出租车', japanese: 'タクシーを呼びます', spanish: 'llamo un taxi' },
    pronunciation: { english: 'call a taxi', chinese: 'jiào chū zū chē', japanese: 'takushii wo yobimasu', spanish: 'llamo un taksi' },
    translation: '택시를 불러요',
  },
  {
    category: 'travel',
    text: { english: 'ask for directions', chinese: '问路', japanese: '道を尋ねます', spanish: 'pregunto por direcciones' },
    pronunciation: { english: 'ask for directions', chinese: 'wèn lù', japanese: 'michi wo tazunemasu', spanish: 'pregunto por direksiones' },
    translation: '길을 물어봐요',
  },
  {
    category: 'travel',
    text: { english: 'reserve a seat', chinese: '预订座位', japanese: '席を予約します', spanish: 'reservo un asiento' },
    pronunciation: { english: 'reserve a seat', chinese: 'yù dìng zuò wèi', japanese: 'seki wo yoyaku shimasu', spanish: 'reservo un asiento' },
    translation: '좌석을 예약해요',
  },
  {
    category: 'travel',
    text: { english: 'exchange money', chinese: '兑换钱', japanese: '両替します', spanish: 'cambio dinero' },
    pronunciation: { english: 'exchange money', chinese: 'duì huàn qián', japanese: 'ryougae shimasu', spanish: 'kambio dinero' },
    translation: '환전해요',
  },
  {
    category: 'travel',
    text: { english: 'show my passport', chinese: '出示护照', japanese: 'パスポートを見せます', spanish: 'muestro mi pasaporte' },
    pronunciation: { english: 'show my passport', chinese: 'chū shì hù zhào', japanese: 'pasupooto wo misemasu', spanish: 'muestro mi pasaporte' },
    translation: '여권을 보여줘요',
  },
  {
    category: 'travel',
    text: { english: 'charge my phone', chinese: '给手机充电', japanese: '携帯を充電します', spanish: 'cargo mi teléfono' },
    pronunciation: { english: 'charge my phone', chinese: 'gěi shǒu jī chōng diàn', japanese: 'keitai wo juuden shimasu', spanish: 'kargo mi telefono' },
    translation: '휴대폰을 충전해요',
  },
  {
    category: 'travel',
    text: { english: 'order coffee', chinese: '点咖啡', japanese: 'コーヒーを注文します', spanish: 'pido café' },
    pronunciation: { english: 'order coffee', chinese: 'diǎn kā fēi', japanese: 'koohii wo chuumon shimasu', spanish: 'pido kafe' },
    translation: '커피를 주문해요',
  },
];

const businessActions: GeneratedAction[] = [
  {
    category: 'business',
    text: { english: 'prepare the report', chinese: '准备报告', japanese: '報告書を準備します', spanish: 'preparo el informe' },
    pronunciation: { english: 'prepare the report', chinese: 'zhǔn bèi bào gào', japanese: 'houkokusho wo junbi shimasu', spanish: 'preparo el informe' },
    translation: '보고서를 준비해요',
  },
  {
    category: 'business',
    text: { english: 'join the meeting', chinese: '参加会议', japanese: '会議に参加します', spanish: 'participo en la reunión' },
    pronunciation: { english: 'join the meeting', chinese: 'cān jiā huì yì', japanese: 'kaigi ni sanka shimasu', spanish: 'partisipo en la reunion' },
    translation: '회의에 참석해요',
  },
  {
    category: 'business',
    text: { english: 'share the agenda', chinese: '分享议程', japanese: '議題を共有します', spanish: 'comparto la agenda' },
    pronunciation: { english: 'share the agenda', chinese: 'fēn xiǎng yì chéng', japanese: 'gidai wo kyouyuu shimasu', spanish: 'komparto la agenda' },
    translation: '안건을 공유해요',
  },
  {
    category: 'business',
    text: { english: 'review the budget', chinese: '审查预算', japanese: '予算を確認します', spanish: 'reviso el presupuesto' },
    pronunciation: { english: 'review the budget', chinese: 'shěn chá yù suàn', japanese: 'yosan wo kakunin shimasu', spanish: 'rebiso el presupuesto' },
    translation: '예산을 검토해요',
  },
  {
    category: 'business',
    text: { english: 'send the email', chinese: '发送邮件', japanese: 'メールを送ります', spanish: 'envío el correo' },
    pronunciation: { english: 'send the email', chinese: 'fā sòng yóu jiàn', japanese: 'meeru wo okurimasu', spanish: 'enbio el korreo' },
    translation: '이메일을 보내요',
  },
  {
    category: 'business',
    text: { english: 'confirm the schedule', chinese: '确认日程', japanese: '予定を確認します', spanish: 'confirmo el horario' },
    pronunciation: { english: 'confirm the schedule', chinese: 'què rèn rì chéng', japanese: 'yotei wo kakunin shimasu', spanish: 'konfirmo el orario' },
    translation: '일정을 확인해요',
  },
  {
    category: 'business',
    text: { english: 'discuss the plan', chinese: '讨论计划', japanese: '計画を話し合います', spanish: 'hablo del plan' },
    pronunciation: { english: 'discuss the plan', chinese: 'tǎo lùn jì huà', japanese: 'keikaku wo hanashiaimasu', spanish: 'ablo del plan' },
    translation: '계획을 논의해요',
  },
  {
    category: 'business',
    text: { english: 'update the client', chinese: '向客户汇报', japanese: '顧客に報告します', spanish: 'actualizo al cliente' },
    pronunciation: { english: 'update the client', chinese: 'xiàng kè hù huì bào', japanese: 'kokyaku ni houkoku shimasu', spanish: 'aktualiso al kliente' },
    translation: '고객에게 업데이트해요',
  },
  {
    category: 'business',
    text: { english: 'check the contract', chinese: '检查合同', japanese: '契約書を確認します', spanish: 'reviso el contrato' },
    pronunciation: { english: 'check the contract', chinese: 'jiǎn chá hé tóng', japanese: 'keiyakusho wo kakunin shimasu', spanish: 'rebiso el kontrato' },
    translation: '계약서를 확인해요',
  },
  {
    category: 'business',
    text: { english: 'finish the presentation', chinese: '完成演示文稿', japanese: '発表資料を完成させます', spanish: 'termino la presentación' },
    pronunciation: { english: 'finish the presentation', chinese: 'wán chéng yǎn shì wén gǎo', japanese: 'happyou shiryou wo kansei sasemasu', spanish: 'termino la presentasion' },
    translation: '발표 자료를 완성해요',
  },
];

const dailyContexts: GeneratedContext[] = [
  { category: 'daily', text: { english: 'in the morning', chinese: '早上', japanese: '朝に', spanish: 'por la mañana' }, pronunciation: { english: 'in the morning', chinese: 'zǎo shang', japanese: 'asa ni', spanish: 'por la manyana' }, translation: '아침에' },
  { category: 'daily', text: { english: 'in the afternoon', chinese: '下午', japanese: '午後に', spanish: 'por la tarde' }, pronunciation: { english: 'in the afternoon', chinese: 'xià wǔ', japanese: 'gogo ni', spanish: 'por la tarde' }, translation: '오후에' },
  { category: 'daily', text: { english: 'in the evening', chinese: '晚上', japanese: '夜に', spanish: 'por la noche' }, pronunciation: { english: 'in the evening', chinese: 'wǎn shang', japanese: 'yoru ni', spanish: 'por la noche' }, translation: '저녁에' },
  { category: 'daily', text: { english: 'before work', chinese: '上班前', japanese: '仕事の前に', spanish: 'antes del trabajo' }, pronunciation: { english: 'before work', chinese: 'shàng bān qián', japanese: 'shigoto no mae ni', spanish: 'antes del trabajo' }, translation: '출근 전에' },
  { category: 'daily', text: { english: 'after class', chinese: '下课后', japanese: '授業の後に', spanish: 'después de clase' }, pronunciation: { english: 'after class', chinese: 'xià kè hòu', japanese: 'jugyou no ato ni', spanish: 'despues de klase' }, translation: '수업 후에' },
  { category: 'daily', text: { english: 'on weekends', chinese: '周末', japanese: '週末に', spanish: 'los fines de semana' }, pronunciation: { english: 'on weekends', chinese: 'zhōu mò', japanese: 'shuumatsu ni', spanish: 'los fines de semana' }, translation: '주말에' },
  { category: 'daily', text: { english: 'at home', chinese: '在家', japanese: '家で', spanish: 'en casa' }, pronunciation: { english: 'at home', chinese: 'zài jiā', japanese: 'ie de', spanish: 'en kasa' }, translation: '집에서' },
  { category: 'daily', text: { english: 'before bed', chinese: '睡觉前', japanese: '寝る前に', spanish: 'antes de dormir' }, pronunciation: { english: 'before bed', chinese: 'shuì jiào qián', japanese: 'neru mae ni', spanish: 'antes de dormir' }, translation: '자기 전에' },
  { category: 'daily', text: { english: 'every day', chinese: '每天', japanese: '毎日', spanish: 'todos los días' }, pronunciation: { english: 'every day', chinese: 'měi tiān', japanese: 'mainichi', spanish: 'todos los dias' }, translation: '매일' },
  { category: 'daily', text: { english: 'when I have time', chinese: '有时间的时候', japanese: '時間がある時に', spanish: 'cuando tengo tiempo' }, pronunciation: { english: 'when I have time', chinese: 'yǒu shí jiān de shí hou', japanese: 'jikan ga aru toki ni', spanish: 'kuando tengo tiempo' }, translation: '시간이 있을 때' },
];

const travelContexts: GeneratedContext[] = [
  { category: 'travel', text: { english: 'at the airport', chinese: '在机场', japanese: '空港で', spanish: 'en el aeropuerto' }, pronunciation: { english: 'at the airport', chinese: 'zài jī chǎng', japanese: 'kuukou de', spanish: 'en el aeropuerto' }, translation: '공항에서' },
  { category: 'travel', text: { english: 'at the station', chinese: '在车站', japanese: '駅で', spanish: 'en la estación' }, pronunciation: { english: 'at the station', chinese: 'zài chē zhàn', japanese: 'eki de', spanish: 'en la estasion' }, translation: '역에서' },
  { category: 'travel', text: { english: 'at the hotel', chinese: '在酒店', japanese: 'ホテルで', spanish: 'en el hotel' }, pronunciation: { english: 'at the hotel', chinese: 'zài jiǔ diàn', japanese: 'hoteru de', spanish: 'en el otel' }, translation: '호텔에서' },
  { category: 'travel', text: { english: 'near the museum', chinese: '在博物馆附近', japanese: '博物館の近くで', spanish: 'cerca del museo' }, pronunciation: { english: 'near the museum', chinese: 'zài bó wù guǎn fù jìn', japanese: 'hakubutsukan no chikaku de', spanish: 'serka del museo' }, translation: '박물관 근처에서' },
  { category: 'travel', text: { english: 'on the bus', chinese: '在公交车上', japanese: 'バスで', spanish: 'en el autobús' }, pronunciation: { english: 'on the bus', chinese: 'zài gōng jiāo chē shàng', japanese: 'basu de', spanish: 'en el autobus' }, translation: '버스에서' },
  { category: 'travel', text: { english: 'at the restaurant', chinese: '在餐厅', japanese: 'レストランで', spanish: 'en el restaurante' }, pronunciation: { english: 'at the restaurant', chinese: 'zài cān tīng', japanese: 'resutoran de', spanish: 'en el restaurante' }, translation: '식당에서' },
  { category: 'travel', text: { english: 'before departure', chinese: '出发前', japanese: '出発前に', spanish: 'antes de salir' }, pronunciation: { english: 'before departure', chinese: 'chū fā qián', japanese: 'shuppatsu mae ni', spanish: 'antes de salir' }, translation: '출발 전에' },
  { category: 'travel', text: { english: 'after arrival', chinese: '到达后', japanese: '到着後に', spanish: 'después de llegar' }, pronunciation: { english: 'after arrival', chinese: 'dào dá hòu', japanese: 'touchaku go ni', spanish: 'despues de llegar' }, translation: '도착 후에' },
  { category: 'travel', text: { english: 'during the trip', chinese: '旅行中', japanese: '旅行中に', spanish: 'durante el viaje' }, pronunciation: { english: 'during the trip', chinese: 'lǚ xíng zhōng', japanese: 'ryokou chuu ni', spanish: 'durante el biaje' }, translation: '여행 중에' },
  { category: 'travel', text: { english: 'at the information desk', chinese: '在服务台', japanese: '案内所で', spanish: 'en información' }, pronunciation: { english: 'at the information desk', chinese: 'zài fú wù tái', japanese: 'annaijo de', spanish: 'en informasion' }, translation: '안내 데스크에서' },
];

const businessContexts: GeneratedContext[] = [
  { category: 'business', text: { english: 'today', chinese: '今天', japanese: '今日', spanish: 'hoy' }, pronunciation: { english: 'today', chinese: 'jīn tiān', japanese: 'kyou', spanish: 'oy' }, translation: '오늘' },
  { category: 'business', text: { english: 'tomorrow morning', chinese: '明天早上', japanese: '明日の朝', spanish: 'mañana por la mañana' }, pronunciation: { english: 'tomorrow morning', chinese: 'míng tiān zǎo shang', japanese: 'ashita no asa', spanish: 'manyana por la manyana' }, translation: '내일 아침에' },
  { category: 'business', text: { english: 'before lunch', chinese: '午饭前', japanese: '昼食前に', spanish: 'antes del almuerzo' }, pronunciation: { english: 'before lunch', chinese: 'wǔ fàn qián', japanese: 'chuushoku mae ni', spanish: 'antes del almuerzo' }, translation: '점심 전에' },
  { category: 'business', text: { english: 'after the call', chinese: '通话后', japanese: '電話の後に', spanish: 'después de la llamada' }, pronunciation: { english: 'after the call', chinese: 'tōng huà hòu', japanese: 'denwa no ato ni', spanish: 'despues de la llamada' }, translation: '통화 후에' },
  { category: 'business', text: { english: 'this week', chinese: '这周', japanese: '今週', spanish: 'esta semana' }, pronunciation: { english: 'this week', chinese: 'zhè zhōu', japanese: 'konshuu', spanish: 'esta semana' }, translation: '이번 주에' },
  { category: 'business', text: { english: 'next Monday', chinese: '下周一', japanese: '来週の月曜日', spanish: 'el próximo lunes' }, pronunciation: { english: 'next Monday', chinese: 'xià zhōu yī', japanese: 'raishuu no getsuyoubi', spanish: 'el proksimo lunes' }, translation: '다음 월요일에' },
  { category: 'business', text: { english: 'by Friday', chinese: '周五前', japanese: '金曜日までに', spanish: 'para el viernes' }, pronunciation: { english: 'by Friday', chinese: 'zhōu wǔ qián', japanese: 'kinyoubi made ni', spanish: 'para el biernes' }, translation: '금요일까지' },
  { category: 'business', text: { english: 'during the meeting', chinese: '会议中', japanese: '会議中に', spanish: 'durante la reunión' }, pronunciation: { english: 'during the meeting', chinese: 'huì yì zhōng', japanese: 'kaigi chuu ni', spanish: 'durante la reunion' }, translation: '회의 중에' },
  { category: 'business', text: { english: 'after review', chinese: '审核后', japanese: '確認後に', spanish: 'después de revisar' }, pronunciation: { english: 'after review', chinese: 'shěn hé hòu', japanese: 'kakunin go ni', spanish: 'despues de rebisar' }, translation: '검토 후에' },
  { category: 'business', text: { english: 'before the deadline', chinese: '截止日期前', japanese: '締め切り前に', spanish: 'antes de la fecha límite' }, pronunciation: { english: 'before the deadline', chinese: 'jié zhǐ rì qī qián', japanese: 'shimekiri mae ni', spanish: 'antes de la fecha limite' }, translation: '마감 전에' },
];

const generatedGroups = [
  { category: 'daily' as const, actions: dailyActions, contexts: dailyContexts },
  { category: 'travel' as const, actions: travelActions, contexts: travelContexts },
  { category: 'business' as const, actions: businessActions, contexts: businessContexts },
];

const buildGeneratedPhrase = (
  id: number,
  language: Language,
  action: GeneratedAction,
  context: GeneratedContext,
  category: Category,
  level: number
): Phrase => {
  const translations = {
    daily: `저는 ${context.translation} ${action.translation}`,
    travel: `저는 ${context.translation} ${action.translation}`,
    business: `우리는 ${context.translation} ${action.translation}`,
  };

  const textByLanguage = {
    english:
      category === 'business'
        ? `We need to ${action.text.english} ${context.text.english}`
        : `I ${action.text.english} ${context.text.english}`,
    chinese:
      category === 'travel'
        ? `我需要${context.text.chinese}${action.text.chinese}`
        : category === 'business'
          ? `我们需要${context.text.chinese}${action.text.chinese}`
          : `我${context.text.chinese}${action.text.chinese}`,
    japanese:
      category === 'business'
        ? `${context.text.japanese}${action.text.japanese}`
        : `${context.text.japanese}${action.text.japanese}`,
    spanish:
      category === 'business'
        ? `Necesitamos ${action.text.spanish} ${context.text.spanish}`
        : `${action.text.spanish} ${context.text.spanish}`,
  };

  const pronunciationByLanguage = {
    english: textByLanguage.english,
    chinese:
      category === 'travel'
        ? `wǒ xū yào ${context.pronunciation.chinese} ${action.pronunciation.chinese}`
        : category === 'business'
          ? `wǒ men xū yào ${context.pronunciation.chinese} ${action.pronunciation.chinese}`
          : `wǒ ${context.pronunciation.chinese} ${action.pronunciation.chinese}`,
    japanese: `${context.pronunciation.japanese} ${action.pronunciation.japanese}`,
    spanish:
      category === 'business'
        ? `nesesitamos ${action.pronunciation.spanish} ${context.pronunciation.spanish}`
        : `${action.pronunciation.spanish} ${context.pronunciation.spanish}`,
  };

  return {
    id,
    text: textByLanguage[language],
    translation: translations[category],
    pronunciation: pronunciationByLanguage[language],
    category,
    level,
  };
};

const expandLanguagePhrases = (language: Language) => {
  const phrases = [...basePhrasesData[language]];
  let generatedIndex = 0;

  while (phrases.length < targetPhraseCount) {
    const group = generatedGroups[generatedIndex % generatedGroups.length];
    const action = group.actions[Math.floor(generatedIndex / generatedGroups.length) % group.actions.length];
    const context =
      group.contexts[
        Math.floor(generatedIndex / (generatedGroups.length * group.actions.length)) % group.contexts.length
      ];
    const level = (generatedIndex % 5) + 1;
    const nextId = Math.max(...phrases.map((phrase) => phrase.id)) + 1;

    phrases.push(buildGeneratedPhrase(nextId, language, action, context, group.category, level));
    generatedIndex += 1;
  }

  return phrases;
};

export const phrasesData: Record<Language, Phrase[]> = {
  english: expandLanguagePhrases('english'),
  chinese: expandLanguagePhrases('chinese'),
  japanese: expandLanguagePhrases('japanese'),
  spanish: expandLanguagePhrases('spanish'),
};
