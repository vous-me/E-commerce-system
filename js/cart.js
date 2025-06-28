// js/cart.js
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalElement = document.getElementById('cartTotal');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartSummaryDiv = document.querySelector('.cart-summary');
    const checkoutButton = document.querySelector('.btn-checkout');

    // --- 新增：支付模态框元素 ---
    const paymentModal = document.getElementById('paymentModal');
    const modalOrderTotalElement = document.getElementById('modalOrderTotal');
    const confirmPaymentButton = document.getElementById('confirmPaymentButton');
    const closeBtn = document.querySelector('.modal .close-button'); // 获取模态框的关闭按钮

    // 调用在 script.js 中定义的全局函数来更新用户登录状态和导航栏购物车计数器
    if (typeof updateUserLoginStatus === 'function') {
        updateUserLoginStatus();
    }
    if (typeof updateCartCounter === 'function') {
        updateCartCounter();
    }

    displayCartItems();

    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (!cartItemsContainer) return; 
        cartItemsContainer.innerHTML = ''; 

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartSummaryDiv) cartSummaryDiv.style.display = 'none'; 
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartSummaryDiv) cartSummaryDiv.style.display = 'block'; 

        let totalAmount = 0;
        const table = document.createElement('table');
        table.classList.add('cart-table'); 
        table.innerHTML = `
            <thead>
                <tr>
                    <th>商品</th>
                    <th>图片</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>小计</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        cart.forEach((item, index) => {
            const itemRow = document.createElement('tr');
            itemRow.classList.add('cart-item-row');
            itemRow.innerHTML = `
                <td>${item.name}</td>
                <td><img src="${item.image || 'images/placeholder_product.png'}" alt="${item.name}" style="width: 50px; height: auto;"></td>
                <td>¥${item.price.toFixed(2)}</td>
                <td class="cart-item-quantity">
                    <button class="quantity-change" data-index="${index}" data-change="-1" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-change" data-index="${index}" data-change="1">+</button>
                </td>
                <td>¥${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="remove-item" data-index="${index}">移除</button></td>
            `;
            tbody.appendChild(itemRow);
            totalAmount += item.price * item.quantity;
        });

        cartItemsContainer.appendChild(table);
        if (cartTotalElement) cartTotalElement.textContent = totalAmount.toFixed(2);
        // 确保在计算 totalAmount 后，也更新模态框中的总金额显示
        if (modalOrderTotalElement) modalOrderTotalElement.textContent = totalAmount.toFixed(2); 
        
        addEventListenersToCartButtons();
    }

    function addEventListenersToCartButtons() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const indexToRemove = parseInt(this.dataset.index);
                removeItemFromCart(indexToRemove);
            });
        });

        document.querySelectorAll('.quantity-change').forEach(button => {
            button.addEventListener('click', function() {
                const indexToChange = parseInt(this.dataset.index);
                const change = parseInt(this.dataset.change);
                updateItemQuantity(indexToChange, change);
            });
        });
    }

    function removeItemFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); 
        if (typeof updateCartCounter === 'function') updateCartCounter();
    }

    function updateItemQuantity(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // const productStockElement = document.getElementById('productStock_' + cart[index].id); 
        // const stock = productStockElement ? parseInt(productStockElement.textContent) : Infinity; 

        if (cart[index]) {
            const newQuantity = cart[index].quantity + change;
            // if (newQuantity > stock) {
            //     alert(\`库存不足！\${cart[index].name} 最大库存为 \${stock}。\`);
            //     return;
            // }
            if (newQuantity <= 0) { 
                removeItemFromCart(index);
            } else {
                cart[index].quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCartItems(); 
                if (typeof updateCartCounter === 'function') updateCartCounter();
            }
        }
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                alert('请先登录再进行结算！');
                localStorage.setItem('redirectAfterLogin', window.location.href);
                window.location.href = 'auth.html';
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('您的购物车是空的，无法结算！');
                return;
            }

            // 计算总金额
            let currentTotal = 0;
            cart.forEach(item => { currentTotal += item.price * item.quantity; });
            
            // 跳转到新的支付页面，并传递金额和临时订单ID作为参数
            const tempOrderId = 'CART' + Date.now(); // 创建一个临时的ID，支付页面可以用它或生成新的
            window.location.href = `payment_page.html?amount=${currentTotal.toFixed(2)}&orderId=${tempOrderId}`;
        });
    }

    // 移除旧的模态框相关逻辑，因为现在跳转到新页面
    // function closePaymentModal() { ... }
    // if (closeBtn) { ... }
    // window.addEventListener('click', function(event) { ... });
    // if (confirmPaymentButton) { ... }
        });
    // }

    // 检查登录后是否需要重定向回购物车 (或其他页面)
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    // 确保只在用户真正从auth.html登录后重定向，而不是每次加载cart.html都检查
    if (redirectUrl && window.location.pathname.includes('cart.html') && document.referrer && document.referrer.includes('auth.html') && localStorage.getItem('isLoggedIn') === 'true') {
        // 如果是从 auth.html 跳转过来的，并且已登录
        localStorage.removeItem('redirectAfterLogin'); // 清除标记，避免循环
        // window.location.href = redirectUrl; // 如果 cart.html 本身就是目标，则无需跳转
                                            // 如果 auth.html 将 redirectUrl 设为其他页面，则这里需要跳转
                                            // 但由于我们是在cart.js中，通常意味着用户已在cart.html
    } else if (redirectUrl && !document.referrer.includes('auth.html') && localStorage.getItem('isLoggedIn') !== 'true') {
        // 如果用户未登录就离开了auth.html（例如直接输入cart.html地址），则清除重定向标记
        localStorage.removeItem('redirectAfterLogin');
    }
 // 结束 DOMContentLoaded 事件监听器


