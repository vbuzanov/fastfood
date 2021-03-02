'use strict';

let elements = document.forms.f1.elements;
let size = elements.size;
let add = elements.add;
let topp = elements.topp;
let cutlet = elements.cutlet;
let cutletNum = elements.cutletNum;
let calc = elements.calc;
calc.disabled = true;
let res = document.getElementById('res');
let countAdd = 1;
let num = 0;

class Burger{
    #priceBurger = 0;
    #kcalBurger = 0;
    static priceSize = {large:100, small:50};
    static kcalSize = {large:40, small:20};
    static priceAdd = {cheese:10, potato:15, salad:20};
    static kcalAdd = {cheese:20, potato:10, salad:5};
    static priceTopp = {mayonez:20, spice:15};
    static kcalTopp = {mayonez:5, spice:0};
    constructor(sizeB, addB){
        this._size = sizeB; //'large'
        this._add = addB; //array
        this._topp = null; //array
    }
    static createBurger(){
        return new Burger('large', ['cheese','salad']);
    }
    calcAdd(){
        let price = 0; 
        let kcal = 0;
        for (let i = 0; i < this._add.length; i++) {
            price += Burger.priceAdd[this._add[i]];
            kcal += Burger.kcalAdd[this._add[i]];
        }
        return {price:price, kcal:kcal};
    }
    calcTopp(){
        let price = 0; 
        let kcal = 0;
        for (let i = 0; i < this._topp.length; i++) {
            price += Burger.priceTopp[this._topp[i]];
            kcal += Burger.kcalTopp[this._topp[i]];
        }
        return {price:price, kcal:kcal};
    }
    setTopp(topping){
        if(!arguments.length) return this._topp;
        this._topp = topping;
    }
    price(){
        this.#priceBurger += Burger.priceSize[this._size];
        this.#priceBurger += this.calcAdd().price;
        if(this._topp)this.#priceBurger += this.calcTopp().price;
        return this.#priceBurger;
    }
    kcal(){
        this.#kcalBurger += Burger.kcalSize[this._size];
        this.#kcalBurger += this.calcAdd().kcal;
        if(this._topp)this.#kcalBurger += this.calcTopp().kcal;
        return this.#kcalBurger;
    }
};

class CutletBurger extends Burger{
    static priceCutlet = {chicken:40, mushrooms:30, pork:50, fish:60};
    static kcalCutlet = {chicken:30, mushrooms:20, pork:40, fish:30};
    constructor(sizeB, addB, meatCutlet, meatCutletNum){
        super(sizeB, addB);
        this._size = sizeB;
        this._add = addB;
        this._meatCutlet = meatCutlet;
        this._meatCutletNum = meatCutletNum;
    }
    price(){
        let priceB = super.price();
        return priceB += (CutletBurger.priceCutlet[this._meatCutlet]*this._meatCutletNum);
    }
    kcal(){
        let kcalB = super.kcal();
        return kcalB += (CutletBurger.kcalCutlet[this._meatCutlet]*this._meatCutletNum);
    }
};

for (let i = 0; i < cutlet.length; i++) {
    if(cutlet[i].checked) cutlet[i].nextElementSibling.disabled = false;
    else cutlet[i].nextElementSibling.disabled = true;
}

for (let i = 0; i < cutlet.length; i++) {
    cutlet[i].addEventListener('click', ()=>{
        for (let i = 0; i < cutletNum.length; i++) {
            cutletNum[i].disabled = true;
            cutletNum[i].value = '';
            num = 0;
            calc.disabled = true;
        }
        cutlet[i].nextElementSibling.disabled = false;
        cutlet[i].nextElementSibling.focus();
    })
}

for (let i = 0; i < add.length; i++) {
    add[i].addEventListener('click', ()=>{
        let count = 0;
        for (let j = 0; j < add.length; j++) {
            if(add[j].checked) count++;
        }
        countAdd = count;
        if(countAdd && num>=1 && num<=3) calc.disabled = false;
        else calc.disabled = true;
    })
}

for (let i = 0; i < cutletNum.length; i++){
    cutletNum[i].addEventListener('input', (event)=>{
            num = cutletNum[i].value;
            if(countAdd && num>=1 && num<=3) calc.disabled = false;
            else calc.disabled = true;
        })
}

calc.addEventListener('click', (event)=>{
    event.preventDefault();
    let addVal = [];
    for (let i = 0; i < add.length; i++){
        if(add[i].checked) addVal.push(add[i].value);
    }
    let toppVal = [];
    for (let i = 0; i < topp.length; i++){
        if(topp[i].checked) toppVal.push(topp[i].value);
    }
    const userCutletBurger = new CutletBurger(size.value, addVal, cutlet.value, num);
 
    if(toppVal.length) userCutletBurger.setTopp(toppVal);
    res.innerHTML = `Ваш заказ будет стоить: ${userCutletBurger.price()}$, калорийность: ${userCutletBurger.kcal()}kcal`;
})



