const SUPABASE_URL = "https://wyigvufavodbzywbfudc.supabase.co";
const SUPABASE_KEY = "sb_publishable_Rgz6SfQsA60LzUHt5n-uaQ_NQGYHeAB";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const addItemButton = document.getElementById("add-item-button");
const cancelButton = document.getElementById("cancel-button");
const formSection = document.getElementById("item-form-section");
const itemForm = document.getElementById("item-form");

addItemButton.addEventListener("click", () => {
  formSection.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
  formSection.classList.add("hidden");
  itemForm.reset();
});

itemForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const status = document.getElementById("status").value;
  const description = document.getElementById("description").value;

  const { data, error } = await supabaseClient
    .from("project_items")
    .insert([
      {
        title: title,
        category: category,
        status: status,
        description: description
      }
    ]);

  if (error) {
    console.error("Error adding item:", error);
    alert("There was an error adding the project item.");
    return;
  }

  console.log("Item added:", data);

  alert("Project item added successfully!");

  itemForm.reset();
  formSection.classList.add("hidden");
});