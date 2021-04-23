import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ForgotPassword extends StatefulWidget {
  @override
  _ForgotPasswordState createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {
  TextEditingController _emailController = TextEditingController();
  bool _validateEmail = false;
  void validateForm() {
    Pattern pattern =
        r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
    RegExp regex = new RegExp(pattern);
    if (!regex.hasMatch(_emailController.text)) {
      setState(() {
        _validateEmail = true;
      });
    } else {
      setState(() {
        _validateEmail = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightBlueAccent,
        iconTheme: IconThemeData(color: Colors.white),
        centerTitle: true,
        title: Text(
          "Forgot Password",
          style: TextStyle(fontFamily: "Montserrat-Medium"),
        ),
      ),
      backgroundColor: Colors.white,
      body: new Container(
        padding: const EdgeInsets.all(5.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              "Enter your email address?",
              style: TextStyle(
                  color: Colors.lightBlueAccent,
                  fontFamily: "Poppins-Medium",
                  fontSize: 20),
            ),
            SizedBox(
              height: 30,
            ),
            Text("Enter email to recieve password reset link",
                style: TextStyle(fontFamily: "Poppins-Medium", fontSize: 14)),
            Container(
              width: ScreenUtil.getInstance().setWidth(500),
              child: TextField(
                controller: _emailController,
                decoration: InputDecoration(
                    errorText: _validateEmail ? "Enter a valid email" : null,
                    icon: Icon(
                      Icons.email,
                      color: Colors.lightBlue,
                    ),
                    hintText: "Email",
                    hintStyle: TextStyle(color: Colors.grey, fontSize: 12.0)),
              ),
            ),
            SizedBox(
              height: 30,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                InkWell(
                  child: Container(
                    width: ScreenUtil.getInstance().setWidth(400),
                    height: ScreenUtil.getInstance().setHeight(100),
                    decoration: BoxDecoration(
                        color: Colors.lightBlue,
                        borderRadius: BorderRadius.circular(6.0),
                        boxShadow: [
                          BoxShadow(
                              color: Color(0xFF6078ea).withOpacity(.3),
                              offset: Offset(0.0, 8.0),
                              blurRadius: 8.0)
                        ]),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () {
                          validateForm();
                          if (_validateEmail == false) {
                            final FirebaseAuth _firebaseAuth =
                                FirebaseAuth.instance;
                            try {
                              _firebaseAuth.sendPasswordResetEmail(
                                  email: _emailController.text);
                            } catch (ex) {
                              print(ex.toString());
                            }

                            showDialog(
                                context: context,
                                builder: (BuildContext buildContext) {
                                  return new AlertDialog(
                                    title: new Text("Email Sent"),
                                    content: new Text(
                                        "Please check inbox for password reset link."),
                                  );
                                });
                          }
                        },
                        child: Center(
                          child: Text("Send Reset Link",
                              style: TextStyle(
                                  color: Colors.white,
                                  fontFamily: "Poppins-Bold",
                                  fontSize: 18,
                                  letterSpacing: 1.0)),
                        ),
                      ),
                    ),
                  ),
                )
              ],
            ),
          ],
        ),
      ),
    );
  }
}
