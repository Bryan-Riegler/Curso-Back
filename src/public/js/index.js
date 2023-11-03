document.addEventListener("DOMContentLoaded", () => {
    const socketClient = io();
    const form = document.getElementById('product-form');
    const inputTitle = document.getElementById("title");
    const inputDescription = document.getElementById("description");
    const inputPrice = document.getElementById("price");
    const inputCode = document.getElementById("code");
    const inputStock = document.getElementById("stock");
    const inputCategory = document.getElementById("category");
    const tableContainer = document.getElementById('table-container');


    socketClient.on("products", (products) => {

        const tableHTML = `
            <table id="products-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Código</th>
                        <th>Estado</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.title}</td>
                            <td>${product.description}</td>
                            <td>$${product.price}</td>
                            <td>${product.category}</td>
                            <td>${product.stock}</td>
                            <td>${product.code}</td>
                            <td>${product.status}</td>
                            <td>${product.id}</td>
                            <td>
                                <button class="select-product" data-id=${product.id}>Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        socketClient.emit("addProduct", {
            title: inputTitle.value,
            description: inputDescription.value,
            price: inputPrice.value,
            code: inputCode.value,
            stock: inputStock.value,
            category: inputCategory.value
        });
        inputTitle.value = ""
        inputDescription.value = ""
        inputPrice.value = ""
        inputCode.value = ""
        inputStock.value = ""
        inputCategory.value = ""
    });

    tableContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("select-product")) {
            const productId = event.target.getAttribute("data-id");
            socketClient.emit("selectProduct", productId);
        }
    });
});