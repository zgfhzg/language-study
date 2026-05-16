import { Category, Language, Phrase } from '@/data/phrases';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export { isSupabaseConfigured };

export interface HistoryEntry extends Phrase {
  language: Language;
  learnedAt: string;
  lastTranscript: string;
}

interface LearningHistoryRow {
  phrase_id: number;
  language: Language;
  category: Category;
  level: number;
  phrase_text: string;
  translation: string;
  pronunciation: string;
  last_transcript: string;
  learned_at: string;
}

const deviceIdStorageKey = 'language-practice-device-id-v1';

export const getDeviceId = () => {
  let deviceId = window.localStorage.getItem(deviceIdStorageKey);

  if (!deviceId) {
    deviceId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    window.localStorage.setItem(deviceIdStorageKey, deviceId);
  }

  return deviceId;
};

const mapRowToHistoryEntry = (row: LearningHistoryRow): HistoryEntry => ({
  id: row.phrase_id,
  language: row.language,
  text: row.phrase_text,
  translation: row.translation,
  pronunciation: row.pronunciation,
  category: row.category,
  level: row.level,
  learnedAt: row.learned_at,
  lastTranscript: row.last_transcript,
});

export const loadLearningHistory = async (deviceId: string) => {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('learning_history')
    .select(
      'phrase_id, language, category, level, phrase_text, translation, pronunciation, last_transcript, learned_at'
    )
    .eq('device_id', deviceId)
    .order('learned_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapRowToHistoryEntry(row as LearningHistoryRow));
};

export const saveLearningHistoryEntry = async (
  deviceId: string,
  language: Language,
  phrase: Phrase,
  spokenText: string
) => {
  const learnedAt = new Date().toISOString();
  const entry: HistoryEntry = {
    ...phrase,
    language,
    learnedAt,
    lastTranscript: spokenText,
  };

  if (!isSupabaseConfigured || !supabase) {
    return entry;
  }

  const { error } = await supabase.from('learning_history').upsert(
    {
      device_id: deviceId,
      phrase_id: phrase.id,
      language,
      category: phrase.category,
      level: phrase.level,
      phrase_text: phrase.text,
      translation: phrase.translation,
      pronunciation: phrase.pronunciation,
      last_transcript: spokenText,
      learned_at: learnedAt,
    },
    { onConflict: 'device_id,language,phrase_id' }
  );

  if (error) {
    throw error;
  }

  return entry;
};
