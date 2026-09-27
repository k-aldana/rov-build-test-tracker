/*
  =====================================================
  SUPABASE CONNECTION
  =====================================================

  These values connect the website to the Supabase
  project that stores our ROV project information.

  The publishable key is intended for frontend/browser use.
*/

const SUPABASE_URL =
  "https://wyigvufavodbzywbfudc.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Rgz6SfQsA60LzUHt5n-uaQ_NQGYHeAB";


// Create a Supabase client that will be used for database requests
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/*
  =====================================================
  PAGE ELEMENTS
  =====================================================

  Get references to the HTML elements we need to control
  with JavaScript.
*/

const addItemButton =
  document.getElementById("add-item-button");

const cancelButton =
  document.getElementById("cancel-button");

const formSection =
  document.getElementById("item-form-section");

const itemForm =
  document.getElementById("item-form");

const projectItemsContainer =
  document.getElementById("project-items");

const categoryFilter =
  document.getElementById("category-filter");

const statusFilter =
  document.getElementById("status-filter");


/*
  Stores the database ID of the item currently being edited.

  null means we are creating a new item.

  If this contains an ID, submitting the form will update
  that existing database row instead.
*/
let editingItemId = null;


/*
  =====================================================
  OPEN ADD ITEM FORM
  =====================================================
*/

addItemButton.addEventListener("click", () => {

  // Make sure we are creating a new item instead of editing
  editingItemId = null;

  // Remove any old values from the form
  itemForm.reset();

  // Show the form
  formSection.classList.remove("hidden");
});


/*
  =====================================================
  CANCEL FORM
  =====================================================
*/

cancelButton.addEventListener("click", () => {

  // Hide the form
  formSection.classList.add("hidden");

  // Clear form values
  itemForm.reset();

  // Exit edit mode
  editingItemId = null;
});


/*
  =====================================================
  LOAD PROJECT ITEMS
  =====================================================

  Retrieves project items from Supabase and displays
  them as cards on the webpage.
*/

async function loadProjectItems() {

  /*
    Start a database query.

    select("*") retrieves every column.

    The results are sorted by creation date so the newest
    project items appear first.
  */
  let query = supabaseClient
    .from("project_items")
    .select("*")
    .order("created_at", { ascending: false });


  // Get the currently selected filters
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;


  /*
    Only add a category filter to the database query
    when the user selected a specific category.
  */
  if (selectedCategory !== "all") {
    query = query.eq(
      "category",
      selectedCategory
    );
  }


  /*
    Only add a status filter when a specific status
    has been selected.
  */
  if (selectedStatus !== "all") {
    query = query.eq(
      "status",
      selectedStatus
    );
  }


  // Send the completed query to Supabase
  const { data, error } = await query;


  // Handle database errors
  if (error) {

    console.error(
      "Error loading project items:",
      error
    );

    projectItemsContainer.innerHTML = `
      <p>
        There was an error loading the project items.
      </p>
    `;

    return;
  }


  // Remove the old project cards before displaying new ones
  projectItemsContainer.innerHTML = "";


  // Display a message if the database contains no matching items
  if (data.length === 0) {

    projectItemsContainer.innerHTML = `
      <p>No project items found.</p>
    `;

    return;
  }


  /*
    Loop through every row returned by Supabase
    and create a project card for each item.
  */
  data.forEach((item) => {

    // Create a new div for the card
    const projectCard =
      document.createElement("div");

    projectCard.classList.add("project-card");


    /*
      Convert the database timestamp into a shorter,
      easier-to-read date.
    */
    const createdDate =
      new Date(item.created_at).toLocaleDateString();


    /*
      Convert the status text into a CSS-friendly class.

      Example:

      "In Progress"
      becomes
      "in-progress"

      This lets CSS give each status its own appearance.
    */
    const statusClass = item.status
      .toLowerCase()
      .replaceAll(" ", "-");


    // Build the contents of the project card
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


    // Add the completed card to the webpage
    projectItemsContainer.appendChild(
      projectCard
    );
  });
}


/*
  =====================================================
  ADD OR UPDATE PROJECT ITEM
  =====================================================

  Runs whenever the Save Item button is pressed.
*/

itemForm.addEventListener(
  "submit",
  async (event) => {

    /*
      Prevent the browser from refreshing the page
      when the form is submitted.
    */
    event.preventDefault();


    // Read the values entered into the form
    const title =
      document.getElementById("title")
        .value
        .trim();

    const category =
      document.getElementById("category")
        .value;

    const status =
      document.getElementById("status")
        .value;

    const description =
      document.getElementById("description")
        .value
        .trim();


    // Stores a possible Supabase error
    let error;


    /*
      If editingItemId is null, the user is creating
      a brand-new project item.
    */
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

      /*
        If editingItemId contains an ID, update the
        existing database row instead of creating one.
      */

      const result = await supabaseClient
        .from("project_items")
        .update({
          title: title,
          category: category,
          status: status,
          description: description
        })
        .eq(
          "id",
          editingItemId
        );

      error = result.error;
    }


    // Stop if Supabase reports an error
    if (error) {

      console.error(
        "Error saving item:",
        error
      );

      alert(
        "There was an error saving the project item."
      );

      return;
    }


    /*
      Tell the user whether an item was created
      or updated.
    */
    if (editingItemId === null) {

      alert(
        "Project item added successfully!"
      );

    } else {

      alert(
        "Project item updated successfully!"
      );
    }


    // Exit edit mode
    editingItemId = null;


    // Clear the form
    itemForm.reset();


    // Hide the form
    formSection.classList.add("hidden");


    /*
      Reload the project cards so the user immediately
      sees the database changes.
    */
    loadProjectItems();
  }
);


/*
  =====================================================
  DELETE PROJECT ITEM
  =====================================================

  Removes a project item from the Supabase database.
*/

async function deleteProjectItem(id) {

  /*
    Ask for confirmation before permanently
    deleting the database row.
  */
  const confirmed = confirm(
    "Are you sure you want to delete this project item?"
  );


  // Stop if the user presses Cancel
  if (!confirmed) {
    return;
  }


  // Delete the row whose ID matches the selected card
  const { error } = await supabaseClient
    .from("project_items")
    .delete()
    .eq(
      "id",
      id
    );


  // Handle any database errors
  if (error) {

    console.error(
      "Error deleting item:",
      error
    );

    alert(
      "There was an error deleting the project item."
    );

    return;
  }


  // Reload the list after deletion
  loadProjectItems();
}


/*
  =====================================================
  EDIT PROJECT ITEM
  =====================================================

  Retrieves one project item from Supabase and places
  its existing values into the form.
*/

async function editProjectItem(id) {

  /*
    Find exactly one database row whose ID matches
    the project item the user selected.
  */
  const { data, error } = await supabaseClient
    .from("project_items")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();


  // Handle database errors
  if (error) {

    console.error(
      "Error loading item:",
      error
    );

    alert(
      "There was an error loading the project item."
    );

    return;
  }


  /*
    Save the ID so the form knows it should update
    this item when Save Item is pressed.
  */
  editingItemId = id;


  // Fill the form with the item's existing information
  document.getElementById("title").value =
    data.title;

  document.getElementById("category").value =
    data.category;

  document.getElementById("status").value =
    data.status;

  document.getElementById("description").value =
    data.description || "";


  // Show the form
  formSection.classList.remove("hidden");


  /*
    Scroll back to the top so the user can immediately
    see the edit form.
  */
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/*
  =====================================================
  FILTER EVENT LISTENERS
  =====================================================

  Reload the project list whenever either filter changes.
*/


// Category filter
categoryFilter.addEventListener(
  "change",
  () => {
    loadProjectItems();
  }
);


// Status filter
statusFilter.addEventListener(
  "change",
  () => {
    loadProjectItems();
  }
);


/*
  =====================================================
  INITIAL PAGE LOAD
  =====================================================

  Load the project items as soon as the webpage opens.
*/

loadProjectItems();