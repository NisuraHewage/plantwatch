import 'package:flutter/material.dart';
import './widget/messaging_widget.dart';

class NotificationTest extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(),
        body: MessagingWidget(),
      );
}
