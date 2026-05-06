import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zgxmvwxzjmpmesqliwxl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cGJQMAam_R4JU3X4IEIrkQ_EPeSsQIt';

/**
 * SOVEREIGN MESH SUPABASE CLIENT
 * Used for high-level synchronization when the local Hub is out of range.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
