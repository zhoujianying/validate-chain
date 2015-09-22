Validate-Chain
==============
表单验证链，以及中文验证错误反馈信息

###Motivation 为啥要写这个工具？
以NODE作为后端开发单页应用时，前后端对表单的验证的逻辑和返回的提示信息其实是一样的，应该做到前后端共用验证逻辑，在React应用中这一点就更重要了。目前后端可以使用的koa-validate,express-validate等验证util又不能在前端使用，而且似乎目前还没有一个是中文提示信息的，于是就决定自己写一个前后端共用的链状验证器。验证器去检查多个字段并在最后返回一个提示信息的数组，已经消毒后的数据；

### 之前在angular项目中这样写过
重复的if return, 以及大量的错误提示信息。。。。。
```javascript
validator.loginForm = ({credential,password,email}) => {
	if( !credential ) return err("手机号或者Email地址，你忘了吧");
	if( !password ) return err("你是不是忘了填写密码了");
	if( /emailRegx/.test(email)) return err("这个不是Email地址。。。")
 	....
 	.... blah blah blah

	var san = {credential,password};
	return { san }
}

function err( msg ){
	return { verr:msg }
}
```
###使用 Validate-Chain
```javascript
import VC from "validate-chain";

var objectData = {age:22,name:"eisneim",gender:"guy",email:"ss.kjk"}
validator.loginForm() => {	
	var vc = new VC( objectData )
	vc.check("email").email()
	vc.check("desc").alias("描述").required()
	vc.check("opt").optional().max(2,"must not bigger than 2");
	vc.check("name").required("名字为必填项");
	vc.check("age").required().min(23).numeric().in([22,33,44])//可以一直链下去
	vc.check("gender").alias("性别").regx(/male|female/).in(["男","女"])
	

	console.log( vc.errors )
	//["描述: 为必填字段", "age: 最小值为23", "性别: 不合格/male|female/的格式", "ss.kjk不是常规的email"]
	console.log( vc.sanitized )
	// {name: "eisneim"}
}
```

###浏览器中使用
```
bower install --save validate-chain
```
```html
<script src="路径/validate-chain-browser.js"></script>
```
```javascript
// VC 为全局变量
var vc = new VC( objectData )
vc.check("name").required("名字为必填项");
//console.log( vc.errors )

```
###安装
```
npm install --save validate-chain

// es5
var VC = require("validate-chain")

// es6
import VC form "validate-chain"

```
###开发
```
// 测试
gulp test

// build
gulp build

```

###API
 - **check(key)** 以它作为开始
 - **errors** 检查完后，读取这个属性即可获取所有的错误提示
 - **sanitized** 检查完后读取这个属性即可获得消毒后的属性
 - **alias(name)** 如果设置了别名，错误信息将以这个别名开始
 - **required([tip])** 必填，大部分情况下需要在链中指明，
 - **optional()** 可选，大部分情况下需要在链中指明，
 - **between(min,max,[tip])** 如果value是字符串则比较长度，数字则比较大小
 - **max(number,[tip])** 如果value是字符串则比较长度，数字则比较大小
 - **min(number,[tip])** 如果value是字符串则比较长度，数字则比较大小
 - **regx( /regx/,[tip] )** 传入正则表达式对象，或者字符串的正则：\w.?end$不加首尾的/
 - **date(dateString,[tip])** 是否为时间格式
 - **before(dateString,[tip])** 时间在dateString之前
 - **after(dateString,[tip])** 时间在dateString之后
 - **in(Array,[tip])** 在一个数组值之一
 - **email([tip],[options])** options: allow_display_name:false 是否匹配 “姓名 <email-地址>”; allow_utf8_local_part:true 是否限定只能使用英文字母和数字； 
 - **JSON([tip])** 是否是格式没有错误的JSON
 - **URL([tip],[options])** 检查是否是正常的URL，options:  protocols: ['http','https','ftp']指定可以用的协议， require_protocol:false 是否可以不用指定协议
 - **phone([tip])** 检查手机号
 - **numeric([tip])** 检查是否为数字
 - **float([tip])** 是否为浮点数
 - **alpha([tip])** 是否为纯字母
 - **alphanumeric([tip])** 是否为字母+数字
 - **ascii([tip])** 是否是ascii 码
 - **objectId([tip])** 是否为Mongodb ObjectID
 - **base64([tip])** 是否为base64格式字符串编码
 - **creditCard([tip])** 是否为信用卡
 - **currency(options,[tip])** 是否为货币，默认值：{symbol: '￥', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }.
 -


### sanitizers 消毒器
```javascript
// data = { name:"  小明 "}
vc.check("name").required("名字为必填项").trim();

console.log( vc.sanitized ) // {name:"小明"}
```

 - **trim()** 去掉首尾空格
 - **escape()** 将<, >, &, ', " /替换为HTML编码
 - **whitelist(chars)** 白名单 eg. whitelist("a-zA-Z") 将会变成：replace(/[^a-zA-Z]/g,"")
 - **blacklist(chars)** 黑名单 eg. whitelist("被和谐|不和谐|查水表") 将会变成：replace(/[被和谐|不和谐|查水表]/g,"")
 - **toBoolean([strict])** 
 - **toDate()** 转换为日期对象
 - **toFloat()** 浮点数
 - **toInt([radix])** 整数，radix为进制
 - **toString()** 转换为字符串


