# 面試用專案
### Note
作答請建立一個server ,並針對題目提供各一個api接口回覆答案

作答用api範例可參考此postman連結
https://www.getpostman.com/collections/9ed68f39bf4c1257dbf9
```
Eg.
Respose: [
    {	
        ‘發生問題狀況說明’: ‘XXXXX’,
        ‘問題資料’: id or account
    }	
]
```

### Topic 1
卡茲有一張資料表,是儲存帳號經過交易前的點數、增減的點數、交易結果的表，並且資料是有交易就會insert一行資料，但是他發現資料好像怪怪的，能幫幫他找出問題嗎?
Api_url : http://test.sub.sakawa.com.tw/api.php?r=transfer_log
```
Api_Respose: [
    {
        insert_id: 這個是資料庫儲存的順序給予的id,
        createtime: 這是資料創建的時間,
        orig: 這是該筆資料的原始值,
        add: 預增減的點數,
        new: 這是運算後的結果
    },{
        insert_id: 這個是資料庫儲存的順序給予的id,
        createtime: 這是資料創建的時間,
        orig: 這是上一筆資料的運算結果,
        add: 預增減的點數,
        new: 這是運算後的結果
    },
    // 以此類推
]
```
Ans: 
1. 通常點數小於等於零，便不能再進行扣點數的交易。
2. 應該多一個欄位存這筆交易是怎麼增加還是減少的，不然單看資料不知道這些點數為什麼而增減。例如 action: "top-up"，代表這筆點數的來源是儲值。
3. "insert_id":"9455"這筆資料後的點數與前面對不上，理論上會有一張資料表示存使用者點數餘額，交易紀錄中的orig欄位便是參考那張資料表；因此可能要先去檢查玩家目前餘額對不對，再來決定這筆交易紀錄要怎麼處理。
4. 在"insert_id":"680"和679順序不對，不過排序一下就沒事了

**答案：https://keke-test.herokuapp.com/topic1**

---
### Topic 2
牛肉麵有三張資料表分別儲存[帳號等級,對應等級發放的點數,自動發放的點數紀錄],但是他發現有客戶拿到的點數不正確,幫忙他找出是哪個客戶發生了問題?
帳號等級
Api_url : http://test.sub.sakawa.com.tw/api.php?r=test_account
對應等級發放的點數
Api_url : http://test.sub.sakawa.com.tw/api.php?r=test_gift
自動發放的點數紀錄
Api_url : http://test.sub.sakawa.com.tw/api.php?r=test_gift_log

**答案：https://keke-test.herokuapp.com/topic2**

---
### Topic 3
建立1個function判斷輸入之麻將牌組int array有沒有胡牌，並回傳指定array格式，輸入整理排序後只判斷吃與胡牌(眼牌)，以及是否符合3n +2 (吃 + 眼)組合，如附圖：

![](https://i.imgur.com/ZazIVV4.png)

附註：
檔案內pai_cht 內為數字對應牌型
實作為兩層迴圈，配合邏輯判斷
行數需小於200行

**答案：https://keke-test.herokuapp.com/topic3**
