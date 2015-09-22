var expect = require('chai').expect;
var VC = require("../validate-chain.js");
var tmp = new Buffer("some value");

var mock = {
	name: "eisneim",
	age: 24,
	email: "eisneim1@gmail.com",
	email2: "eisneim <sdfjk@gmail.com>",
	site: "http://glexe.com",
	siteInvalid: "glexe.com",
	phone: "13482783201",
	phoneInvalid: "1348278320",
	objectId: "55d855455e7ad2da26025512",
	base64: tmp.toString("base64"),
	ascii: tmp.toString("ascii"),
	buget: "￥100",
	hex: tmp.toString("hex"),
	alpha:"soemstringABC",
	alphanumeric:"asd23234",
	float:3.141568,
	decimal: 0.25,

	future:"2048-10-2 12:22",
	now: new Date(),
	dateInvalid:" 2015-20-3 12:22",

}

describe('Validator-Chain checkers',function(){
// before(), after(), beforeEach()

	it("should check require() and optional()",function(){
		var vc = new VC( mock );
		vc.check("name").required();
		vc.check("null").optional().max(3);

		expect( vc.errors ).to.be.empty;

		vc.check("null").required();
		expect( vc.errors ).to.have.length(1);
	});

	it("should change Error message if .aliase() presents",function(){
		var vc = new VC( mock );
		vc.check("name").alias("姓名").in(["terry","mike"])
		vc.check("age").alias("年龄").between(10,18,"应该在十到十八之间")

		expect( vc.errors[0] ).to.have.string("姓名")
		expect( vc.errors[1] ).to.match(/年龄.+之间/)
	})

	it("should be chainable,key with optional() should be skiped",function(){
		var vc = new VC( mock );
		vc.check("age").between(10,18).max(18).in([21,22,23]);
		vc.check("null").optional().between(10,18).max(18).in([21,22,23]);
		expect( vc.errors).to.have.length(3);
	})

	it("can use regx",function(){
		var vc = new VC( mock );
		vc.check("name").regx(/^eis./i).regx("eim$",null,"i")

		expect(vc.errors).to.be.empty;
	})

	it("can deal with common string format",function(){
		var vc = new VC( mock );
		vc.check("phone").phone()
		vc.check("phoneInvalid").phone()
		expect( vc.errors ).to.have.length(1);

		vc.check("email").email()
		vc.check("email2").email(null,{ allow_display_name: true })
		vc.check("phone").email()
		expect( vc.errors ).to.have.length(2);

		vc.check("site").URL()
		vc.check("siteInvalid").URL()
		vc.check("phone").URL()
		expect( vc.errors ).to.have.length(3);

		vc.check("objectId").objectId();
		vc.check("base64").base64();
		vc.check("ascii").ascii();
		vc.check("buget").currency()
		expect( vc.errors ).to.have.length(3);
	})

	it("can deal with Date",function(){
		var vc = new VC( mock );
		var now = new Date()
		vc.check("future").date();
		vc.check("dateInvalid").date()
		expect( vc.errors ).to.have.length(1);

		vc.check("future").after("2015-8-1 11:33").after( now );
		vc.check("now").before("Tue Sep 22 2045 11:46:12 GMT+0800 (CST)" )
		expect( vc.errors ).to.have.length( 1 )

	})

	it("can deal with numbers and Alphabetic",function(){
		var vc = new VC( mock );
		vc.check("hex").hex()
		vc.check("age").between(18,30).max(26).min(21)
		vc.check("float").float()
		vc.check("decimal").decimal()
		vc.check("alpha").alpha()
		vc.check("alphanumeric").alphanumeric()

		expect( vc.errors ).to.be.empty;
	})

});