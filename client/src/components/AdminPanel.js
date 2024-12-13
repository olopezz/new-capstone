import React from "react";
import "./AdminPanel.css"; // Import the CSS file for styles

function AdminPanel() {
  return (
    <div className="admin-panel-container">
      {" "}
      {/* Apply class here */}
      <h1>Admin Panel</h1>
      <p>
        Manage your products effectively. Add new products or update existing
        inventory here.
      </p>
      <form className="admin-panel-form">
        {" "}
        {/* Apply class here */}
        <label>
          Product Name: <input type="text" name="name" />
        </label>
        <label>
          Price: <input type="text" name="price" />
        </label>
        <label>
          Description: <textarea name="description" />
        </label>
        <label>
          Image URL: <input type="text" name="imageUrl" />
        </label>
        <button type="button">Add Product</button>
      </form>
      {/* Future enhancement: list products with edit and delete options */}
    </div>
  );
}

export default AdminPanel;
