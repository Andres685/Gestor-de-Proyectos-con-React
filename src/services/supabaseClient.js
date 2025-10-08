import {createClient} from '@supabase/supabase-js'
// Consumo de la API de supabase para crear un cliente
//  Importa el Url de Conexion con metoso de segurirdad de supabase
const supaBaseUrl = import.meta.env.VITE_SUPABASE_URL
// Key d ela PI de supabase igualmente protegido
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Instancia del modulo del cliente con la URL y la KEY de api de SupaBase que es la conexion.
export const supabase = createClient(supaBaseUrl, supabaseAnonKey)