// 初始化資料
function init(){
    getProductList();
    getCartList(); 
}
init();


// 戳api取產品列表資料
let productData = []; //宣告陣列來放置api回傳的產品資料
function getProductList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(response){
        productData = response.data.products;
        renderProductList();
    })
    .catch(function(error){
        console.log(error);
    })
}

// 渲染產品列表
const productList = document.querySelector('.productWrap');
function renderProductList(){
    let str = '';
    productData.forEach(function(item,index){
        str += combineProductListHTML(item);
    })
    productList.innerHTML = str ;
}

// 產品列表篩選器filter
const productSelect = document.querySelector('.productSelect');
productSelect.addEventListener("change",function(e){
    let str ="";
    let selection = e.target.value ;
    if (selection =="全部"){
        renderProductList();
        return;
    }

    productData.forEach(function(item,index){
        if (selection == item.category){
            str += combineProductListHTML(item);
        }
    })
    productList.innerHTML = str ;
})

// 把重複會用到的組成li的渲染語法抽出來使用
function combineProductListHTML(item){  
    //參數要放入item,因為回傳的str中有item要使用到
    return `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}" >加入購物車</a>
    <h3>${item.title}</h3> 
    <del class="originPrice">${item.origin_price}</del>
    <p class="nowPrice">${item.price}</p>
    </li>`;
}


// 加入購物車
//取得購物車列表
const cartBodyList = document.querySelector(".cart-tbodayList");
const cartTotalMoney = document.querySelector(".js-totalMoney")
let cartData = []; 
function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        cartData = response.data.carts;
        let str = "";
        cartData.forEach(function(item,index){
            str += `<tr>
            <td>
                <div class="cardItem-title">
                    <img src="${item.product.images}" alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price*item.quantity}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${item.id}">
                    clear
                </a>
            </td>
        </tr>`
        })
        cartBodyList.innerHTML = str ;
        cartTotalMoney.innerHTML =`<span class="js-totalMoney">${response.data.finalTotal}</span>`;

    })
    .catch(function(error){
        console.log(error);
    })
}

//點擊按鈕把產品加入購物車
//新增產品列表的按鈕監聽
productList.addEventListener("click",function(e){
    e.preventDefault(); // 因為點擊加入購物車會有錨點跑到最上面
    // 在渲染li的加入購物車按鈕中加入data-id取得產品id資訊, 才知道要加入哪個產品到購物車
    let ProductID = e.target.getAttribute("data-id"); //取出點擊產品id的值

    //過濾掉非點擊"加入購物車"按鈕的事件
    if (ProductID == null){
        // alert("請點擊加入購物車");
        return;
    }else{
        console.log(ProductID);
    }

    // 計算購物車產品數量: 產品id已在購物車數量+1,無就要新增
    let cartProductNum = 1;
    cartData.forEach(function(item,index){
        if(item.product.id == ProductID){
            cartProductNum = item.quantity+= 1; // 購物車產品數量+addProductNum, 要回傳給api
        }
    })
    console.log(cartProductNum);

    //把購買資料回傳, 戳api更新購物車資料
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
          "productId": ProductID,
          "quantity": cartProductNum
        }
      })
    .then(function(response){
        alert("成功加入購物車");
        getCartList();
    })
    .catch(function(error){
        console.log(error);
    })
    
});


//刪除購物車資料
cartBodyList.addEventListener("click",function(e){
    e.preventDefault(); //消除點擊後畫面回到最頂#
    //在渲染出來的cartbody中, 刪除按鈕新增data-id來辨識
    console.log(e.target)
    
    let cartId = e.target.getAttribute("data-id");//取出點擊購物車id的值
    console.log(cartId);

    if(cartId == null){
        // alert("請點擊刪除按鈕");
        return;
    }

    //執行刪除購物車指定品項
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function(response){
        alert("刪除購物車產品");
        getCartList();
    })
    .catch(function(error){
        console.log(error);
    })
    
});

//執行刪除整個購物車

const deleteAllBtn = document.querySelector(".discardAllBtn");
deleteAllBtn.addEventListener("click",function(e){
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        alert("購物車已清空");
        getCartList();
    })
    .catch(function(error){
        console.log(error);
        alert("購物車已清空了唷唷唷");
    })

})
