import { supabase } from "../supabaseClient";

export async function getKits() {
  const { data, error } = await supabase
    .from("kits")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
