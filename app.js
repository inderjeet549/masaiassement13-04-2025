import { db } from './firebase-config.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});
document.addEventListener('DOMContentLoaded', () => {
  loadPage('home');
});
function navigate(page) {
  loadPage(page);
}
window.navigate=navigate
function loadPage(page) {
  const main = document.getElementById('main-content');
  if (page === 'home') {
    main.innerHTML = `
      <section>
        <h2>Welcome to the Collaborative Study Notes App!</h2>
        <p>Create, manage, and collaborate on your study notes effectively.</p>
      </section>
    `;
  } else if (page === 'create') {
    main.innerHTML = `
      <section>
        <h2>Create New Study Note</h2>
        <form id="note-form">
          <input type="text" id="title" placeholder="Title" required>
          <textarea id="description" placeholder="Description" required></textarea>
          <select id="priority">
            <option value="High">High</option>
            <option value="Medium" selected>Medium</option>
            <option value="Low">Low</option>
          </select>
          <input type="file" id="image">
          <button type="submit">Save Note</button>
        </form>
      </section>
    `;
    document.getElementById('note-form').addEventListener('submit', saveNote);
  } else if (page === 'view') {
    loadNotes();
  } else if (page === 'settings') {
    main.innerHTML = `
      <section>
        <h2>App Settings</h2>
        <button onclick="toggleDarkMode()">Toggle Dark Mode</button>
        <button onclick="clearLocalNotes()">Clear Local Drafts</button>
      </section>
    `;
  }
}
async function saveNote(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const priority = document.getElementById('priority').value;
  const fileInput = document.getElementById('image');
  const timestamp = new Date();
  const noteData = {
    title,
    description,
    priority,
    createdAt: timestamp,
  };
  if (fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      noteData.image = evt.target.result;
      saveToFirebase(noteData);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveToFirebase(noteData);
  }
}
async function saveToFirebase(noteData) {
  try {
    const docRef = await addDoc(collection(db, 'notes'), noteData);
    console.log("Note saved with ID: ", docRef.id);
    alert("Your note has been successfully saved!");
    loadPage('view');
  } catch (error) {
    console.error("Error saving note: ", error);
    alert("Failed to save note. Please try again.");
  }
}
async function loadNotes() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<section><h2>All Study Notes</h2><div id="notes-list">Loading notes...</div></section>';
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = '';
  try {
    const querySnapshot = await getDocs(collection(db, 'notes'));
    if (querySnapshot.empty) {
      notesList.innerHTML = '<p>No notes found.</p>';
      return;
    }
    querySnapshot.forEach((doc) => {
      const note = doc.data();
      notesList.innerHTML += `
        <div class="note-card">
          <h3>${note.title}</h3>
          <p>${note.description}</p>
          <p>Priority: ${note.priority}</p>
          ${note.image ? `<img src="${note.image}" alt="Note Image" style="width:100px;">` : ''}
          <small>${note.createdAt.toDate ? note.createdAt.toDate().toLocaleString() : new Date(note.createdAt.seconds * 1000).toLocaleString()}</small>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading notes: ", error);
    notesList.innerHTML = '<p>Error loading notes.</p>';
  }
}
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
function clearLocalNotes() {
  localStorage.clear();
  alert('Local drafts cleared!');
}
window.toggleDarkMode = toggleDarkMode;
window.clearLocalNotes = clearLocalNotes;
