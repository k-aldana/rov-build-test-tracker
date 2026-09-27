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
const categoryFilter = document.getElementById("category-filter");
const statusFilter = document.getElementById("status-filter");

let editingItemId = null;


// Open form
addItemButton.addEventListener("click", () => {
  editingItemId = null;
  itemForm.reset();
  formSection.classList.remove("hidden");
});


// Close form
cancelButton.addEventListener("click", () => {
  formSection.classList.add("hidden");
  itemForm.reset();
  editingItemId = null;
});


// Load project items from Supabase
async function loadProjectItems() {

  let query = supabaseClient
    .from("project_items")
    .select("*")
    .order("created_at", { ascending: false });

  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  if (selectedCategory !== "all") {
    query = query.eq("category", selectedCategory);
  }

  if (selectedStatus !== "all") {
    query = query.eq("status", selectedStatus);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading project items:", error);
    projectItemsContainer.innerHTML = `
      <p>There was an error loading the project items.</p>
    `;
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

    const createdDate = new Date(item.created_at).toLocaleDateString();

    const statusClass = item.status
      .toLowerCase()
      .replaceAll(" ", "-");

    projectCard.innerHTML = `
      <h3>${item.title}</h3>

      <p>
        <strong>Category:</strong>
        ${item.category}
      </p>

      <p>
        <strong>Status:</strong>
        <span class="status ${statusClass}">
          ${item.status}
        </span>
      </p>

      <p>
        ${item.description || "No description provided."}
      </p>

      <p class="created-date">
        Created: ${createdDate}
      </p>

      <button onclick="editProjectItem(${item.id})">
        Edit
      </button>

      <button onclick="deleteProjectItem(${item.id})">
        Delete
      </button>
    `;

    projectItemsContainer.appendChild(projectCard);
  });
}


// Submit project item
itemForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const status = document.getElementById("status").value;
  const description = document.getElementById("description").value.trim();

  let error;

  if (editingItemId === null) {

    const result = await supabaseClient
      .from("project_items")
      .insert([
        {
          title: title,
          category: category,
          status: status,
          description: description
        }
      ]);

    error = result.error;

  } else {

    const result = await supabaseClient
      .from("project_items")
      .update({
        title: title,
        category: category,
        status: status,
        description: description
      })
      .eq("id", editingItemId);

    error = result.error;
  }

  if (error) {
    console.error("Error saving item:", error);
    alert("There was an error saving the project item.");
    return;
  }

  if (editingItemId === null) {
    alert("Project item added successfully!");
  } else {
    alert("Project item updated successfully!");
  }

  editingItemId = null;

  itemForm.reset();

  formSection.classList.add("hidden");

  loadProjectItems();
});


// Delete project item
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


// Edit project item
async function editProjectItem(id) {

  const { data, error } = await supabaseClient
    .from("project_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading item:", error);
    alert("There was an error loading the project item.");
    return;
  }

  editingItemId = id;

  document.getElementById("title").value = data.title;
  document.getElementById("category").value = data.category;
  document.getElementById("status").value = data.status;
  document.getElementById("description").value = data.description || "";

  formSection.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Category filter
categoryFilter.addEventListener("change", () => {
  loadProjectItems();
});


// Status filter
statusFilter.addEventListener("change", () => {
  loadProjectItems();
});


// Load items when page opens
loadProjectItems();