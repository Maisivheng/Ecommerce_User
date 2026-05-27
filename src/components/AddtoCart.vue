<script setup lang="ts">
import Navbar from './layout/Navbar.vue';

</script>

<template>
    <Navbar></Navbar>
    <div class="container-fluid layout-wrapper py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="page-title">កន្ត្រកទំនិញ</h1>
            <button class="delete-btn btn-delete-all"><i class="bi bi-trash3"></i>សម្អាតកន្រ្តក់</button>
        </div> 
        <div class="cart-layout p-4">
            <div class="cart-items-container"> 
                <div class="cart-item">
                    <div class="item-img-box col-2">
                        <img src="https://via.placeholder.com/100x100?text=iPhone+16">
                    </div>
                    <div class="item-details col-8 px-4">
                        <span class="item-category">SMART PHONE</span>
                        <h3 class="item-name">iphone 16 pro max</h3>
                        <h3 class="item-name">ស្ថានភាពទំនិញ: ថ្មី</h3>
                        <div class="quantity-selector">
                            <button class="qty-btn">-</button>
                            <input type="text" class="qty-input" value="1" readonly>
                            <button class="qty-btn">+</button>
                        </div>
                    </div>
                    <div class="item-actions col-2">
                        <button class="delete-btn"><i class="bi bi-trash3"></i></button>
                        <small class="item-name">$10តម្លៃក្នុងមួយ</small>
                        <div class="item-price">$1,329.00</div>
                    </div>
                </div>

                <div class="cart-item">
                    <div class="item-img-box col-2">
                        <img src="https://via.placeholder.com/100x100?text=iPhone+16">
                    </div>
                    <div class="item-details col-8 px-4">
                        <span class="item-category">SMART PHONE</span>
                        <h3 class="item-name">iphone 16 pro max</h3>
                        <div class="quantity-selector">
                            <button class="qty-btn">-</button>
                            <input type="text" class="qty-input" value="1" readonly>
                            <button class="qty-btn">+</button>
                        </div>
                    </div>
                    <div class="item-actions col-2">
                        <button class="delete-btn"><i class="bi bi-trash3"></i></button>
                        <div class="item-price">$ 1,329.00</div>
                    </div>
                </div>

                <div class="cart-item">
                    <div class="item-img-box col-2">
                        <img src="https://via.placeholder.com/100x100?text=iPhone+16">
                    </div>
                    <div class="item-details col-8 px-4">
                        <span class="item-category">SMART PHONE</span>
                        <h3 class="item-name">iphone 16 pro max</h3>
                        <div class="quantity-selector">
                            <button class="qty-btn">-</button>
                            <input type="text" class="qty-input" value="1" readonly>
                            <button class="qty-btn">+</button>
                        </div>
                    </div>
                    <div class="item-actions col-2">
                        <button class="delete-btn"><i class="bi bi-trash3"></i></button>
                        <div class="item-price">$ 1,329.00</div>
                    </div>
                </div>
            </div>

            <div class="summary-sidebar">
                <div class="summary-card">
                    <h2 class="summary-title">សង្ខេបការបម្មង់</h2>
                    <div class="summary-row">
                        <span>តម្លៃសរុបបឋម</span>
                        <span class="summary-total">$2,430.00</span>
                    </div>
                    <div class="summary-row">
                        <span>ចំនួនទំនិញ</span>
                        <span class="summary-total">3</span>
                    </div><div class="summary-row">
                        <span class=" fw-normal">ដឹកជញ្ជូន</span>
                        <span class="summary-total fw-normal">ជ្រើសរើសពេលបង់ប្រាក់</span>
                    </div>
                    <hr class="my-3 text-secondary opacity-25">
                    <div class="summary-row">
                        <span>តម្លៃសរុប</span>
                        <span class="summary-qty">$2,430.00</span>
                    </div>
                    <button class="checkout-btn bg-primary">ទូទាត់ប្រាក់</button>
                </div>
            </div>
        </div>

        <div id="productCarousel" class="carousel slide recommendations-carousel d-flex align-items-center justify-content-between gap-2" data-bs-ride="false">
            <button class="custom-nav-arrow border-0" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <i class="bi bi-chevron-left border-0"></i>
            </button>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="carousel-grid">
                        <div class="rec-card">
                            <img src="https://via.placeholder.com/120x120?text=S24+Violet" alt="S24 Violet">
                            <span class="rec-category">SMART PHONE</span>
                            <h4 class="rec-name">Samsung Galaxy S24 Ultra Titanium Violet</h4>
                            <div class="rec-price">$ 1,329.00</div>
                            <button class="view-more-btn bg-primary">មើលបន្ថែម</button>
                        </div>
                        <div class="rec-card">
                            <img src="https://via.placeholder.com/120x120?text=S24+Ultra" alt="S24 Ultra">
                            <span class="rec-category">SMART PHONE</span>
                            <h4 class="rec-name">Samsung Galaxy S24 Ultra</h4>
                            <div class="rec-price">$ 1,099.99</div>
                            <button class="view-more-btn bg-primary">មើលបន្ថែម</button>
                        </div>
                        <div class="rec-card">
                            <img src="https://via.placeholder.com/120x120?text=PC+Gaming" alt="PC Gaming">
                            <span class="rec-category">PC</span>
                            <h4 class="rec-name">iphone 16PC Gaming Case pro max</h4>
                            <div class="rec-price">$ 499.00</div>
                            <button class="view-more-btn bg-primary">មើលបន្ថែម</button>
                        </div>
                    </div>
                </div>
        
                <div class="carousel-item">
                    <div class="carousel-grid">
                        <div class="rec-card">
                            <img src="https://via.placeholder.com/120x120?text=Macbook" alt="Macbook">
                            <span class="rec-category">LAPTOP</span>
                            <h4 class="rec-name">MacBook Pro M3 Max 14-inch</h4>
                            <div class="rec-price">$ 2,499.00</div>
                            <button class="view-more-btn bg-primary">មើលបន្ថែម</button>
                        </div>
                        <div class="rec-card">
                            <img src="https://via.placeholder.com/120x120?text=Keyboard" alt="Keyboard">
                            <span class="rec-category">ACCESSORIES</span>
                            <h4 class="rec-name">Mechanical Gaming Keyboard RGB</h4>
                            <div class="rec-price">$ 89.00</div>
                            <button class="view-more-btn bg-primary">មើលបន្ថែម</button>
                        </div>
                        <div class="rec-card">
                            <img src="https://via.placeholder.com/120x120?text=Headset" alt="Headset">
                            <span class="rec-category">AUDIO</span>
                            <h4 class="rec-name">Wireless Noise Cancelling Headset</h4>
                            <div class="rec-price">$ 199.00</div>
                            <button class="view-more-btn bg-primary">មើលបន្ថែម</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <button class="custom-nav-arrow border-0" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>

        <div class="btn-shopping-action">
            <button class="continue-shopping-btn bg-primary">បន្តការទិញទំនិញ</button>
        </div> 
    </div>
</template>

<style>
    body{
        font-family: "Inter","Kantumruy Pro", sans-serif, serif;
        font-size: 18px;
        background-color: #f6f9fc;
        color: #333333 !important;   
    }
    .layout-wrapper {
        padding: 0 7%;
        max-width: 100%;
        width: 100%;
    }

    .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #212529;
        /* margin-bottom: 24px; */
    }

    /* --- Split Layout Grid --- */
    .cart-layout {
        background-color: #fff;
        border: 2px solid #EAEAEA;
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 24px;
        align-items: start;
        margin-bottom: 40px;
        border-radius: 8px;
    }

    .cart-items-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    /* --- Cart Items --- */
    .cart-item {
        background-color: #EAEAEA; /* Flat structure light gray matching mockup background */
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* gap: 20px; */
    }

    .item-img-box {
        background-color: #fff;
        border-radius: 6px;
        /* width: 110px; */
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
    }

    .item-img-box img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .item-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 110px;
    }

    .item-category {
        font-size: 13px;
        color: #555;
        font-weight: 600;
    }

    .item-name {
        font-size: 14px;
        color: #666;
        font-weight: 400;
        /* margin-top: 2px; */
        /* margin-bottom: 12px; */
    }

    /* Counter UI */
    .quantity-selector {
        display: flex;
        align-items: center;
        border: 1px solid #ced4da;
        border-radius: 8px;
        width: fit-content;
        background: #fff;
        overflow: hidden;
    }

    .qty-btn {
        background: transparent;
        border: none;
        width: 28px;
        height: 26px;
        cursor: pointer;
        font-size: 14px;
        color: #444;
    }

    .qty-input {
        width: 32px;
        height: 26px;
        text-align: center;
        border-left: 1px solid #ced4da;
        border-right: 1px solid #ced4da;
        border-top: none;
        border-bottom: none;
        /* font-size: 13px; */
        background: transparent;
    }

    /* Actions Section right aligned */
    .item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        height: 110px;
        /* padding-top: 4px; */
    }

    .delete-btn{
        background: transparent;
        border: none;
        color: #DC3545; /* Bootstrap Red tint */
        font-size: 14px;
    }
    .btn-delete-all{
        font-size: 14px;
        background-color: #fff;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #a6a8a8;
        color: #DC3545;
    }
    .btn-delete-all:hover{
        font-size: 14px;
        background-color: #c0c1c2;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #c0c1c2;
        color: #DC3545;
    }

    .item-price {
        font-size: 16px;
        font-weight: 600;
        color: #212529;
    }

    /* --- Summary Panel --- */
    .summary-card {
        background-color: #EAEAEA;
        border-radius: 8px;
        padding: 24px;
    }

    .summary-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #212529;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        margin-bottom: 14px;
        color: #333;
    }

    .summary-qty {
        color: #DC3545;
        font-weight: 600;
    }

    .summary-total {
        font-weight: 600;
    }

    .checkout-btn {
        width: 100%;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 14px;
        cursor: pointer;
        margin-top: 10px;
    }

    /* --- Bootstrap Slider Wrapper --- */
    .recommendations-carousel {
        background-color: #EAEAEA;
        border-radius: 8px;
        padding: 20px 15px;
        position: relative;
        margin-bottom: 30px;
    }

    .carousel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        width: 100%;
    }

    .rec-card {
        background: #fff;
        border-radius: 8px;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: start;
    }

    .rec-card img {
        max-height: 120px;
        object-fit: contain;
        /* margin-bottom: 16px; */
    }

    .rec-category {
        font-size: 16px;
        color: #666;
        margin-bottom: 4px;
    }

    .rec-name {
        font-size: 16px;
        color: #444;
        height: 38px;
        overflow: hidden;
        margin-bottom: 16px;
    }

    .rec-price {
        font-size: 15px;
        font-weight: 600;
        color: #212529;
        margin-bottom: 16px;
    }

    .view-more-btn {
        width: 100%;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 14px;
        font-size: 18px;
    }

    /* Custom positioning for Bootstrap slider controls */
    .custom-nav-arrow {
        background: transparent !important;
        background-color: transparent !important;
    }
    .bi-chevron-right, .bi-chevron-left{
        -webkit-text-stroke: 1px #002855;
        width: 100px !important;
        text-align: center;
        background-color: none;
        border-radius: 100%;
    }

    .carousel-control-prev { left: 16px; }
    .carousel-control-next { right: 16px; }

    /* --- shopping Action Elements --- */
    .-btn-shopping-action {
        display: flex;
        justify-content: center;
        margin-top: 24px;
    }

    .continue-shopping-btn {
        width: 300px;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 14px;
        margin-top: 10px;
    }

    /* --- Viewport Responsiveness --- */
    @media (max-width: 992px) {
        .cart-layout {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .carousel-grid {
            grid-template-columns: 1fr 1fr;
        }
        .rec-card:last-child {
            display: none;
        }
    }

    @media (max-width: 576px) {
        .carousel-grid {
            grid-template-columns: 1fr;
        }
        .cart-item {
            flex-direction: column;
            align-items: flex-start;
        }
        .item-actions {
            width: 100%;
            flex-direction: row-reverse;
            height: auto;
            align-items: center;
            margin-top: 10px;
        }
    }
</style>