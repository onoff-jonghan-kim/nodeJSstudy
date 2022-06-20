// this 를 이용해서 자기 자신을 호출할 수 있다.
const o = {
  v1 : 'v1',
  v2 : 'v2',
  f1: function(){
    console.log(this.v1);
  },
  f2: function(){
    console.log(this.v2);
  }
}

o.f1();
o.f2();