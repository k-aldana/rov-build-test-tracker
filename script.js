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
const projectItemsContainer = document.getElementById("project-items");


// Open form
addItemButton.addEventListener("click", () => {
  formSection.classList.remove("hidden");
});


// Close form
cancelButton.addEventListener("click", () => {
  formSection.classList.add("hidden");
  itemForm.reset();
});


// Load project items from Supabase
async function loadProjectItems() {

  const { data, error } = await supabaseClient
    .from("project_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading project items:", error);
    return;
  }

  projectItemsContainer.innerHTML = "";

  if (data.length === 0) {
    projectItemsContainer.innerHTML = `
      <p>No project items found.</p>
    `;

    return;
  }

  data.forEach((item) => {

    const projectCard = document.createElement("div");

    projectCard.classList.add("project-card");

    projectCard.innerHTML = `
      <h3>${item.title}</h3>

      <p>
        <strong>Category:</strong>
        ${item.category}
      </p>

      <p>
        <strong>Status:</strong>
        ${item.status}
      </p>

      <p>
        ${item.description || "No description provided."}
      </p>

      <button>Edit</button>
      <button onclick="deleteProjectItem(${item.id})">Delete</button>
    `;

    projectItemsContainer.appendChild(projectCard);
  });
}


// Add a project item
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

  alert("Project item added successfully!");

  itemForm.reset();

  formSection.classList.add("hidden");

  loadProjectItems();
});


// Delete Project Items
async function deleteProjectItem(id) {

  const confirmed = confirm(
    "Are you sure you want to delete this project item?"
  );

  if (!confirmed) {
    return;
  }

  const { error } = await supabaseClient
    .from("project_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting item:", error);
    alert("There was an error deleting the project item.");
    return;
  }

  loadProjectItems();
}

// Load items when page opens
loadProjectItems();