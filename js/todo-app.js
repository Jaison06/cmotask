$(document).ready(function () {
  const rowsPerPage = 25;
  let currentPage = 1;
  let todos = [];
  let filteredTodos = [];

  let sortField = "id";
  let sortAsc = true;

  function sortData() {
    filteredTodos.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "completed") {
        valA = valA ? 1 : 0;
        valB = valB ? 1 : 0;
      }

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  function updateSortIcons() {
    $("th.sortable").each(function () {
      const field = $(this).data("field");
      const indicator = $(this).find(".sort-indicator");

      if (field === sortField) {
        indicator.html(
          sortAsc
            ? '<i class="bi bi-arrow-up"></i>'
            : '<i class="bi bi-arrow-down"></i>'
        );
      } else {
        indicator.html("");
      }
    });
  }

  function renderTable(page, data) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = data.slice(start, end);

    let html = "";
    pageItems.forEach((todo) => {
      html += `
      <tr>
        <td>${todo.id}</td>
        <td>${todo.userId}</td>
        <td>${todo.title}</td>
        <td>
          ${
            todo.completed
              ? '<span class="badge bg-success">Yes</span>'
              : '<span class="badge bg-danger">No</span>'
          }
        </td>
      </tr>`;
    });
    $("#todoTableBody").html(html);
  }

  function renderPagination(data) {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    let paginationHtml = "";

    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#">${i}</a>
      </li>`;
    }

    $("#pagination").html(paginationHtml);
  }

  function updateView() {
    renderTable(currentPage, filteredTodos);
    renderPagination(filteredTodos);
    updateSortIcons();
  }

  function applySearch() {
    const searchTerm = $("#searchInput").val().toLowerCase();
    filteredTodos = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.userId === parseInt(searchTerm)
    );

    sortData();
    currentPage = 1;
    updateView();
  }

  // Fetch todos
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/todos",
    method: "GET",
    success: function (data) {
      todos = data;
      filteredTodos = data;
      updateView();
    },
    error: function () {
      alert("Failed to load todos.");
    },
  });

  // Handle pagination click
  $(document).on("click", ".page-link", function (e) {
    e.preventDefault();
    currentPage = parseInt($(this).text());
    updateView();
  });

  // Search input
  $("#searchInput").on("input", function () {
    applySearch();
  });

  // Sorting click
  $(document).on("click", "th.sortable", function () {
    const field = $(this).data("field");

    if (sortField === field) {
      sortAsc = !sortAsc; // toggle direction
    } else {
      sortField = field;
      sortAsc = true;
    }

    sortData();
    updateView();
  });
});
