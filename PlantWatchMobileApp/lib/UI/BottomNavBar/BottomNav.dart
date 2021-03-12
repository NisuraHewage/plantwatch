import 'package:flutter/material.dart';
import '../PlantVitals/PlantVitals.dart';

class BottomNav extends StatelessWidget {
  int _currentIndex = 0;
  final List<Widget> _children = [PlantVitalsDashbaord()];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _children[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        selectedIconTheme: IconThemeData(color: Color(0xff2f6954)),
        backgroundColor: Color(0xff4affdb),
        iconSize: 45,
        currentIndex: 0, // this will be set when a new tab is tapped
        items: [
          BottomNavigationBarItem(
            icon: new Icon(Icons.bar_chart),
            title: new Text('Statistics'),
          ),
          BottomNavigationBarItem(
            icon: new Icon(Icons.camera_alt),
            title: new Text('Disease Finder'),
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.book), title: Text('Knowledge Base'))
        ],
      ),
    );
  }
}
