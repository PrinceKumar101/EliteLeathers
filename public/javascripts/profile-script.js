console.log("Script loaded.");

document.querySelector("#uploadicon").addEventListener("click", function () {
  console.log("Upload icon clicked.");
  document.querySelector("#upl-img-input").click();
});

document
  .querySelector("#upl-img-input")
  .addEventListener("change", function () {
    console.log("File input changed.");
    document.querySelector("#prof-upl-form").submit();
  });


  <div class="main w-full h-screen flex flex-col items-center original  ">

        <div class="hidden">
            <form id="prof-upl-form" action="/upl-profile-picture" hidden method="post" enctype="multipart/form-data">
                <input type="file" name="upl-img" />
            </form>
        </div>
        <div class="bg-zinc-200 w-11/12">
            <div class="flex justify-center mt-10">
                <div class="relative w-72 h-72 bg-white shadow-lg rounded-full overflow-hidden border border-gray-300">
                    <img class="w-full h-full object-cover bg-center"
                        src="data:image/jpeg;base64,<%= user.profile_picture.toString('base64') %>"
                        alt="Profile Picture" />
                    <span id="uploadicon"
                        class="absolute bottom-6 right-10 h-14 w-14 flex justify-center items-center bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                        <i class="ri-pencil-fill"></i>
                    </span>
                </div>
            </div>

            <div class="text-center mt-5 ">
                <h2 class="text-4xl font-bold mb-1 ">
                    <%= user.fullname %>
                </h2>
                <h3 class="text-lg  mb-2">
                    <%= user.email_id %>
                </h3>
                <div class="mb-9 pt-10 pb-3  ">
                    <a href="/add-product" class=" bg-blue-500 text-xl hover:bg-blue-600 text-white p-4 rounded ">Add New
                        Product</a>
                    <a href="/logout" class="bg-blue-500 text-xl hover:bg-blue-600 text-white p-4 rounded ml-2 ">Log
                        Out</a>
                </div>

                <% if(!user.seller){ %>
                    <a href="/become-seller" class=" bg-blue-500 text-xl hover:bg-blue-600 text-white p-4 rounded ">Become a
                        Seller</a>
                    <% } %>
            </div>

            <div class="flex flex-wrap  px-10 mt-10 justify-center gap-20">
                <a href="/show/products" class="w-52">
                    <div class="bg-white shadow-lg rounded-lg p-5">
                        <div class="w-full h-40 bg-gray-300 rounded-lg overflow-hidden">
                            <img src="data:image/jpeg;base64,<%= user?.products[0]?.image.toString('base64') %>" class="w-full h-48 object-cover" alt="<%= user?.products[0]?.name %>">
                        </div>
                        <h3 class="text-xl font-semibold mt-5 text-center text-gray-800">Products</h3>
                        <h5 class="text-sm font-medium text-center text-gray-600">
                            <%= user.products.length %> Products
                        </h5>
                    </div>
                </a>
                <a href="/show/cart" class="w-52">
                    <div class="bg-white shadow-lg rounded-lg p-5">
                        <div class="w-full h-40 bg-gray-300 rounded-lg overflow-hidden">
                            <img class="w-full h-full object-cover" src="data:image/jpeg;base64,<%= user?.cart[0]?.image.toString('base64') %>"
                                alt="cart Product">
                        </div>
                        <h3 class="text-xl font-semibold mt-5 text-center text-gray-800">Carts</h3>
                        <h5 class="text-sm font-medium text-center text-gray-600">
                            <%= user.cart.length %> Carts
                        </h5>
                    </div>
                </a>
            </div>
        </div>
    </div>