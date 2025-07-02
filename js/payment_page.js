// js/payment_page.js
document.addEventListener('DOMContentLoaded', function() {
    // 全局UI更新
    if (typeof updateUserLoginStatus === 'function') {
        updateUserLoginStatus();
    }
    if (typeof updateCartCounter === 'function') {
        updateCartCounter();
    }

    // 获取URL参数中的订单信息
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get('orderId'); // 假设从URL传递订单ID
    const orderAmountFromUrl = parseFloat(urlParams.get('amount')); // 假设从URL传递金额

    // 支付方式选择元素
    const selectAlipayRadio = document.getElementById('selectAlipay');
    const selectWechatRadio = document.getElementById('selectWechat');
    const alipayPaymentSection = document.getElementById('alipayPaymentSection');
    const wechatPaymentSection = document.getElementById('wechatPaymentSection');

    // 支付宝区域元素
    const alipayOrderTitleElement = document.getElementById('alipayOrderTitle');
    const alipayOrderAmountElement = document.getElementById('alipayOrderAmount');
    const confirmAlipayOrderButton = document.getElementById('confirmAlipayOrderButton');

    // 微信支付区域元素
    const wechatOrderTitleElement = document.getElementById('wechatOrderTitle'); // 新增
    const wechatOrderAmountElement = document.getElementById('wechatOrderAmount');
    const confirmWechatPaymentButton = document.getElementById('confirmWechatPaymentButton');
    // const wechatRemarksElement = document.getElementById('wechatRemarks'); // 如果需要处理备注，取消注释

    let currentOrderDetails = null;

    // 从localStorage或API获取订单详情
    function loadOrderDetails() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalAmount = 0;
        let orderTitle = "非遗商品购买"; // 默认标题

        if (cart.length > 0) {
            cart.forEach(item => {
                totalAmount += item.price * item.quantity;
            });
            if (cart.length === 1) {
                orderTitle = cart[0].name;
            } else {
                orderTitle = cart[0].name + ' 等多件商品';
            }
        } else if (orderAmountFromUrl && orderIdFromUrl) {
            // 如果购物车为空，但URL中有金额和ID，则使用它们 (用于直接跳转支付页的场景)
            totalAmount = orderAmountFromUrl;
            orderTitle = `订单 ${orderIdFromUrl}`;
        } else {
            // 没有有效订单信息，可以跳转回购物车或提示
            alert('没有有效的订单信息，将返回购物车。');
            window.location.href = 'cart.html';
            return;
        }
        
        currentOrderDetails = {
            id: orderIdFromUrl || 'TEMP' + Date.now(), // 如果没有URL ID，生成临时ID
            title: orderTitle,
            amount: totalAmount,
            items: cart // 保存购物车项目以备后用
        };

        if (alipayOrderTitleElement) alipayOrderTitleElement.textContent = currentOrderDetails.title;
        if (alipayOrderAmountElement) alipayOrderAmountElement.textContent = `¥${currentOrderDetails.amount.toFixed(2)}`;
        if (wechatOrderTitleElement) wechatOrderTitleElement.textContent = currentOrderDetails.title; // 新增
        if (wechatOrderAmountElement) wechatOrderAmountElement.textContent = `¥${currentOrderDetails.amount.toFixed(2)}`;
    }

    loadOrderDetails();

    // 支付方式切换逻辑
    function togglePaymentSections() {
        if (selectAlipayRadio.checked) {
            alipayPaymentSection.style.display = 'block';
            wechatPaymentSection.style.display = 'none';
        } else if (selectWechatRadio.checked) {
            alipayPaymentSection.style.display = 'none';
            wechatPaymentSection.style.display = 'block';
        }
    }

    if (selectAlipayRadio && selectWechatRadio) {
        selectAlipayRadio.addEventListener('change', togglePaymentSections);
        selectWechatRadio.addEventListener('change', togglePaymentSections);
        // 初始化时根据默认选中项显示
        togglePaymentSections(); 
    }

    // 支付宝确认订单按钮事件
    if (confirmAlipayOrderButton) {
        confirmAlipayOrderButton.addEventListener('click', function() {
            // 实际应用中会跳转到支付宝或调用SDK
            alert(`将通过支付宝支付订单：${currentOrderDetails.title}，金额：¥${currentOrderDetails.amount.toFixed(2)}。您已扫码并支付成功。`);
            processSuccessfulPayment('Alipay');
        });
    }

    // 微信支付"我已完成支付"按钮事件
    if (confirmWechatPaymentButton) {
        confirmWechatPaymentButton.addEventListener('click', function() {
            // 实际应用中会轮询后端检查支付状态
            alert(`微信支付订单：${currentOrderDetails.title}，金额：¥${currentOrderDetails.amount.toFixed(2)}。您已扫码并支付成功。`);
            processSuccessfulPayment('WeChat');
        });
    }

    function processSuccessfulPayment(paymentMethod) {
        if (!currentOrderDetails) {
            alert('订单信息丢失，无法处理支付。');
            return;
        }

        const username = localStorage.getItem('username') || 'guest';
        let mockOrders = JSON.parse(localStorage.getItem('mockOrders')) || [];
        
        const newOrder = {
            id: currentOrderDetails.id.startsWith('TEMP') ? ('ORD' + Date.now()) : currentOrderDetails.id, // 如果是临时ID则生成新的
            user: username,
            date: new Date().toISOString().slice(0, 10),
            total: '¥' + currentOrderDetails.amount.toFixed(2),
            status: `已支付 (${paymentMethod})`,
            items: currentOrderDetails.items // 从加载的订单详情中获取
        };
        mockOrders.push(newOrder);
        localStorage.setItem('mockOrders', JSON.stringify(mockOrders));

        localStorage.removeItem('cart'); // 清空购物车
        if (typeof updateCartCounter === 'function') {
            updateCartCounter();
        }

        alert(`支付成功！感谢您的订单 (订单号: ${newOrder.id} - 通过 ${paymentMethod})。`);
        // 跳转到订单成功页面或用户中心
        // window.location.href = 'order_success.html?orderId=' + newOrder.id;
        // 为简单起见，我们先跳转回首页
        window.location.href = 'index.html'; 
    }
});