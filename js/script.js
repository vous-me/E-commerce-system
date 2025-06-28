// js/script.js

// =========================================
// 全局可访问的函数 (供其他脚本或页面事件调用)
// =========================================

/**
 * 更新用户登录状态相关的UI元素，如导航栏。
 */
function updateUserLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    const navAuthLinkContainer = document.querySelector('nav ul li a[href="auth.html"]')?.parentElement; // 获取包含登录/注册链接的<li>元素
    const navList = document.querySelector('header nav ul');

    // 清理之前动态添加的导航元素，防止重复
    document.getElementById('navWelcomeMsg')?.remove();
    document.getElementById('navAdminLink')?.remove();
    document.getElementById('navLogoutLinkLi')?.remove(); // 修改为移除整个li

    if (isLoggedIn === 'true' && navList) {
        if (navAuthLinkContainer) {
            navAuthLinkContainer.style.display = 'none'; // 隐藏 "登录/注册" 链接的<li>
        }

        // 欢迎信息
        const welcomeLi = document.createElement('li');
        welcomeLi.id = 'navWelcomeMsg';
        welcomeLi.textContent = `欢迎, ${username}!`;
        welcomeLi.style.color = '#555'; // 可以通过CSS class来设置样式
        welcomeLi.style.paddingTop = '5px'; // 简单调整对齐
        welcomeLi.style.paddingBottom = '5px';

        // 退出链接
        const logoutLi = document.createElement('li');
        logoutLi.id = 'navLogoutLinkLi';
        const logoutLink = document.createElement('a');
        logoutLink.textContent = '退出';
        logoutLink.href = '#logout'; // 使用 #logout 作为链接，并通过JS处理
        logoutLink.style.cursor = 'pointer';
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            // localStorage.removeItem('cart'); // 退出时是否清空购物车可选
            // localStorage.removeItem('mockOrders'); // 退出时是否清空模拟订单可选
            alert('您已退出！');
            
            // 确保导航栏和购物车计数器立即更新
            if (navAuthLinkContainer) navAuthLinkContainer.style.display = 'list-item'; // 显示登录/注册
            document.getElementById('navWelcomeMsg')?.remove();
            document.getElementById('navAdminLink')?.remove();
            document.getElementById('navLogoutLinkLi')?.remove();
            if (typeof updateCartCounter === 'function') updateCartCounter(); // 再次更新，确保购物车图标正确

            // 如果在管理页面或购物车页面，则跳转到首页
            if (window.location.pathname.includes('admin_') || window.location.pathname.includes('cart.html')) {
                window.location.href = 'index.html';
            } else {
                 window.location.reload(); // 其他页面重新加载以反映状态
            }
        });
        logoutLi.appendChild(logoutLink);

        // 导航项目顺序：首页, 工坊, 商城, [购物车], [管理员后台], 欢迎信息, 退出
        const referenceNode = navList.children[navList.children.length -1]; // 通常是最后一个固定链接（原登录/注册）的上一个
                                                                          // 或者找到一个特定的节点，比如商城链接
        let insertBeforeNode = document.querySelector('nav ul li a[href="auth.html"]')?.parentElement;
        if (!insertBeforeNode) { // 如果登录/注册链接已被隐藏（例如在其他地方动态移除），则添加到末尾
             insertBeforeNode = null; // appendChild会处理null
        }

        if (insertBeforeNode) {
            navList.insertBefore(welcomeLi, insertBeforeNode);
            navList.insertBefore(logoutLi, insertBeforeNode);
        } else { // Fallback to appending if no auth link found
            navList.appendChild(welcomeLi);
            navList.appendChild(logoutLi);
        }
        

        if (userRole === 'admin') {
            const adminDashboardLi = document.createElement('li');
            adminDashboardLi.id = 'navAdminLink';
            const adminLink = document.createElement('a');
            adminLink.href = 'admin_dashboard.html';
            adminLink.textContent = '管理员后台';
            adminDashboardLi.appendChild(adminLink);
            // 插入到欢迎信息之前
            navList.insertBefore(adminDashboardLi, welcomeLi);
        }

        // "我的订单"按钮处理 (产品详情页)
        const myOrdersButton = document.querySelector('.btn-my-orders');
        if (myOrdersButton) {
            myOrdersButton.style.display = 'inline-block';
            if (userRole === 'member') {
                myOrdersButton.href = '#member_orders_placeholder'; // 将来可以是 member_orders.html
                myOrdersButton.onclick = (e) => { e.preventDefault(); alert('查看会员订单功能待进一步实现！'); };
            } else { // 管理员不直接从此按钮查看"我的订单"
                myOrdersButton.style.display = 'none';
            }
        }

    } else { // 用户未登录
        if (navAuthLinkContainer) {
            navAuthLinkContainer.style.display = 'list-item'; // 确保 "登录/注册" 链接的<li>可见
        }
        const myOrdersButton = document.querySelector('.btn-my-orders');
        if (myOrdersButton) {
            myOrdersButton.style.display = 'none';
        }
    }
}

/**
 * 更新导航栏中的购物车商品总数。
 */
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    cart.forEach(item => {
        if (item && typeof item.quantity === 'number') {
            totalItems += item.quantity;
        }
    });

    let cartLi = document.querySelector('li#navCartLinkLi');
    let cartLink;
    let cartCounterSpan;
    const navList = document.querySelector('header nav ul');

    if (!navList) return; // 如果导航列表不存在，则退出

    if (!cartLi) {
        cartLi = document.createElement('li');
        cartLi.id = 'navCartLinkLi';
        cartLink = document.createElement('a');
        cartLink.href = 'cart.html';
        cartLink.textContent = '购物车 '; // 文本后加空格
        cartCounterSpan = document.createElement('span');
        cartCounterSpan.id = 'cartCounter';
        cartLink.appendChild(document.createTextNode('(')); // 用createTextNode添加括号
        cartLink.appendChild(cartCounterSpan);
        cartLink.appendChild(document.createTextNode(')'));
        cartLi.appendChild(cartLink);

        // 尝试将购物车链接插入到 "商城" 之后，或 "登录/注册" 之前
        const mallLi = document.querySelector('header nav ul li a[href="mall.html"]')?.parentElement;
        const authLi = document.querySelector('header nav ul li a[href="auth.html"]')?.parentElement;
        let adminLi = document.getElementById('navAdminLink'); // 管理员链接li
        let welcomeLi = document.getElementById('navWelcomeMsg'); // 欢迎信息li

        if (adminLi) { // 如果有管理员链接，插在其前
            navList.insertBefore(cartLi, adminLi);
        } else if (welcomeLi) { // 如果没有管理员但有欢迎信息（普通用户），插在其前
            navList.insertBefore(cartLi, welcomeLi);
        } else if (authLi) { // 如果都还没登录，插在登录/注册前
             navList.insertBefore(cartLi, authLi);
        } else if (mallLi) { // 如果只有商城，插在商城后
            mallLi.insertAdjacentElement('afterend', cartLi);
        }
        else { // 否则添加到末尾
            navList.appendChild(cartLi);
        }
    } else {
        cartLink = cartLi.querySelector('a');
        cartCounterSpan = cartLink ? cartLink.querySelector('#cartCounter') : null;
    }

    if (cartCounterSpan) {
        cartCounterSpan.textContent = totalItems;
    }
}

/**
 * 切换 auth.html 页面上的登录和注册选项卡。
 * @param {Event} event - 点击事件对象。
 * @param {string} tabName - 要显示的选项卡的ID ('login' 或 'register')。
 */
function openTab(event, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function(tabContent) {
        tabContent.style.display = 'none';
    });
    const tabLinks = document.querySelectorAll('.auth-tabs .tab-link');
    tabLinks.forEach(function(tabLink) {
        tabLink.classList.remove('active');
    });
    const currentTab = document.getElementById(tabName);
    if (currentTab) {
        currentTab.style.display = 'block';
    }
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}


// =========================================
// DOMContentLoaded 事件处理
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    updateUserLoginStatus(); // 页面加载时更新用户状态和导航栏
    updateCartCounter();     // 页面加载时更新购物车计数器

    // --- Login Form ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const usernameInput = document.getElementById('loginUsername');
            const passwordInput = document.getElementById('loginPassword');
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (username === '' || password === '') {
                alert('用户名和密码不能为空！');
                return;
            }

            if (username === 'admin' && password === 'admin123') { // 硬编码的管理员凭据
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('username', username);
                localStorage.setItem('currentUser', JSON.stringify({ username: username, role: 'admin' }));
                localStorage.setItem('token', 'admin_token_abcd123'); // 模拟token
                localStorage.setItem('tokenExpiry', new Date(Date.now() + 3600 * 1000).toISOString()); // token 1小时后过期
                alert('管理员登录成功！');
                window.location.href = 'admin_dashboard.html';
            } else {
                // 检查是否为已注册会员 (从 siteMembers 列表)
                const siteMembers = JSON.parse(localStorage.getItem('siteMembers')) || [];
                // 实际应用中，密码验证应该在后端完成，这里仅模拟用户名存在即登录
                const foundMember = siteMembers.find(member => member.username === username);
                // 也可以添加一个简单的密码检查，但请记住这非常不安全，仅为模拟
                // const foundMember = siteMembers.find(member => member.username === username && member.passwordPlaceholder === password);

                if (foundMember) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userRole', 'member');
                    localStorage.setItem('username', username);
                    alert('登录成功！');
                    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
                    if (redirectAfterLogin) {
                        localStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirectAfterLogin;
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert('用户名或密码错误！(提示：普通用户请先注册)');
                }
            }
        });
    }

    // --- Register Form (已包含存储到 siteMembers 的逻辑) ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const usernameInput = document.getElementById('registerUsername');
            const emailInput = document.getElementById('registerEmail');
            const passwordInput = document.getElementById('registerPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim(); // 密码仅用于验证，不推荐存储
            const confirmPassword = confirmPasswordInput.value.trim();

            if (username === '' || email === '' || password === '' || confirmPassword === '') {
                alert('所有字段均为必填项！');
                return;
            }
            if (password !== confirmPassword) {
                alert('两次输入的密码不匹配！');
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) { // 简单邮箱格式验证
                alert('请输入有效的邮箱地址！');
                return;
            }

            let siteMembers = JSON.parse(localStorage.getItem('siteMembers')) || [];
            const existingUser = siteMembers.find(member => member.username === username || member.email === email);
            if (existingUser) {
                if (existingUser.username === username) alert('该用户名已被注册，请尝试其他用户名！');
                else alert('该邮箱已被注册，请尝试其他邮箱！');
                return;
            }

            const newMember = {
                id: 'USR' + Date.now(),
                username: username,
                email: email,
                role: 'member',
                joined: new Date().toISOString().slice(0, 10)
                // passwordPlaceholder: password // 再次强调：非常不建议存储密码，即使是占位符
            };
            siteMembers.push(newMember);
            localStorage.setItem('siteMembers', JSON.stringify(siteMembers));

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'member');
            localStorage.setItem('username', username);

            alert('注册成功，已自动登录！');
            // updateUserLoginStatus(); // 可选：如果页面不立即跳转，则需要手动更新
            // updateCartCounter();
            window.location.href = 'index.html';
        });
    }

    // --- Quantity Selector for Product Detail Pages ---
    const quantityInput = document.getElementById('quantity');
    const increaseQuantityButton = document.getElementById('increaseQuantity');
    const decreaseQuantityButton = document.getElementById('decreaseQuantity');
    const productStockElement = document.getElementById('productStock');

    if (quantityInput && increaseQuantityButton && decreaseQuantityButton) {
        let maxStock = Infinity;
        if (productStockElement && !isNaN(parseInt(productStockElement.textContent))) {
            maxStock = parseInt(productStockElement.textContent);
        }

        increaseQuantityButton.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < maxStock) {
                quantityInput.value = currentValue + 1;
            } else {
                alert('已达到最大库存数量！');
            }
        });

        decreaseQuantityButton.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        quantityInput.addEventListener('change', function() {
            let currentValue = parseInt(quantityInput.value);
            if (isNaN(currentValue) || currentValue < 1) {
                quantityInput.value = 1;
            } else if (currentValue > maxStock) {
                quantityInput.value = maxStock;
                alert('输入数量已超过库存！已调整为最大库存。');
            }
        });
    }

    // --- Add to Cart Button (on Product Detail Pages) ---
    const addToCartButton = document.querySelector('.btn-buy');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productNameElement = document.getElementById('productName');
            const productPriceElement = document.getElementById('productPrice');
            const productStockElement = document.getElementById('productStock');
            const quantityInput = document.getElementById('quantity');
            const mainImageElement = document.getElementById('mainProductImage');

            // 获取产品ID，使用时间戳确保唯一性
            const productId = this.dataset.productId + '_' + Date.now();

            const productName = productNameElement ? productNameElement.textContent.trim() : '未知商品';
            const priceText = productPriceElement ? productPriceElement.textContent : '0';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const stock = productStockElement ? parseInt(productStockElement.textContent) : 0;
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            const imageSrc = mainImageElement ? mainImageElement.src : 'images/placeholder_product.png';

            if (isNaN(price)) {
                alert('产品价格信息错误！');
                return;
            }
            if (quantity <= 0) {
                alert('购买数量必须大于0！');
                return;
            }
            if (quantity > stock) {
                alert('库存不足！');
                return;
            }

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // 直接添加新商品到购物车，不再检查是否存在
            cart.push({
                id: productId,
                name: productName,
                price: price,
                quantity: quantity,
                image: imageSrc
            });
            
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`已将 ${quantity} 件 "${productName}" 添加到购物车！`);
            updateCartCounter();
        });
    }

    // --- Smooth scrolling for workshop.html sidebar ---
    const sidebarLinks = document.querySelectorAll('.workshop-sidebar ul li a[href^="#"]');
    sidebarLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== "#") { //确保href不是空的#
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        console.warn('Smooth scroll target not found:', targetId);
                    }
                } catch (error) {
                    console.warn('Error with smooth scroll selector:', targetId, error);
                }
            }
        });
    });

    // --- Admin Page Access Control ---
    // 此检查确保用户直接访问admin页面时的权限
    if (window.location.pathname.includes('admin_')) { // 检查URL是否包含 'admin_'
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userRole = localStorage.getItem('userRole');
        if (isLoggedIn !== 'true' || userRole !== 'admin') {
            alert('您没有权限访问此页面。请以管理员身份登录。');
            window.location.href = 'auth.html'; // 未授权则跳转到登录页
        }
    }

}); // End of DOMContentLoaded