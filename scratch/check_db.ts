import { supabase } from "./src/lib/supabase";

async function checkColumn() {
  const { data, error } = await supabase
    .from("orders")
    .select("user_id")
    .limit(1);

  if (error) {
    console.error("Column check failed:", error.message);
  } else {
    console.log("Column check successful. user_id exists.");
  }
}

checkColumn();
