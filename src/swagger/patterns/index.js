module.exports = {
	email: new RegExp(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/),
	/*
    * matches
    geon@ihateregex.io
    test@gmail.com mail@test.org
    mail@testing.com

    theproblem@test@gmail.com [test@gmail.com only]
    mail with@space.com [with@space.com only]

    * not matches
    hello@
    @test
    email@gmail
  */
	phone: new RegExp(
		/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
	),
	/*
    * matches
    +919367788755
    8989829304
    +16308520397
    786-307-3615

    * not matches
    789
    123765
    1-1-1
    +982
  */
	// password: new RegExp(
	// 	/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,32}$/
	// ),
  password: new RegExp(
	/^.{8,32}$/
	),
	/*
    * matches
    gr3at@3wdsG

    * not matches
    a
    ab
    abc
    abcd
    abcde
    john doe
    johnny
    abcdefghijklmnopqrst
    lorem
    ipsum
  */
	url: new RegExp(
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
	),
	/*
    * matches
    https://github.com/geongeorge/i-hate-regex
    https://www.facebook.com/
    https://www.google.com/
    https://xkcd.com/2293/
    http://www.example.com/

    * not matches
    https://this-shouldn't.match@example.com
  */
};
