import { Component, OnInit } from '@angular/core';

import * as Gojs from 'gojs';

@Component({
  selector: 'nk-go',
  templateUrl: './go.component.html',
  styleUrls: ['./go.component.css']
})
export class GoComponent implements OnInit {
  constructor() {}
  myDiagram;

  ngOnInit() {
    this.initGraph();
  }

  click() {
    console.log(this.myDiagram);
  }

  private initGraph() {
    let $ = Gojs.GraphObject.make;
    this.myDiagram = $(Gojs.Diagram, 'myDiagramDiv', {
      initialContentAlignment: Gojs.Spot.Left,
      initialAutoScale: Gojs.Diagram.UniformToFill,
      layout: $(Gojs.LayeredDigraphLayout, { direction: 0 }),
      'undoManager.isEnabled': true
    });

    this.myDiagram.addDiagramListener('Modified', e => {
      let button: HTMLButtonElement = <HTMLButtonElement>(
        document.getElementById('SaveButton')
      );
      if (button) {
        button.disabled = !this.myDiagram.isModified;
      }
      let idx = document.title.indexOf('*');
      if (this.myDiagram.isModified) {
        if (idx < 0) {
          document.title += '*';
        }
      } else {
        if (idx >= 0) {
          document.title = document.title.substr(0, idx);
        }
      }
    });

    this.myDiagram.linkTemplate = $(
      Gojs.Link,
      {
        routing: Gojs.Link.Orthogonal,
        corner: 5,
        relinkableFrom: true,
        relinkableTo: true
      },
      $(Gojs.Shape, { stroke: 'gray', strokeWidth: 2 }),
      $(Gojs.Shape, { stroke: 'gray', fill: 'gray', toArrow: 'Standard' })
    );

    this.makeTemplates();
    this.load();

  }

  private makePort(name, leftside) {
    let $ = Gojs.GraphObject.make;
    let port = $(Gojs.Shape, 'Rectangle', {
      fill: 'gray',
      stroke: null,
      desiredSize: new Gojs.Size(8, 8),
      portId: name, // declare this object to be a "port"
      toMaxLinks: 1, // don't allow more than one link into a port
      cursor: 'pointer' // show a different cursor to indicate potential link point
    });
    let lab = $(
      Gojs.TextBlock,
      name, // the name of the port
      { font: '7pt sans-serif' }
    );
    let panel = $(Gojs.Panel, 'Horizontal', { margin: new Gojs.Margin(2, 0) });
    // set up the port/panel based on which side of the node it will be on
    if (leftside) {
      port.toSpot = Gojs.Spot.Left;
      port.toLinkable = true;
      lab.margin = new Gojs.Margin(1, 0, 0, 1);
      panel.alignment = Gojs.Spot.TopLeft;
      panel.add(port);
      panel.add(lab);
    } else {
      port.fromSpot = Gojs.Spot.Right;
      port.fromLinkable = true;
      lab.margin = new Gojs.Margin(1, 1, 0, 0);
      panel.alignment = Gojs.Spot.TopRight;
      panel.add(lab);
      panel.add(port);
    }
    return panel;
  }

  private makeTemplate(typename, icon, background, inports, outports) {
    let $ = Gojs.GraphObject.make;
    let node = $(
      Gojs.Node,
      'Spot',
      $(
        Gojs.Panel,
        'Auto',
        { width: 100, height: 120 },
        $(Gojs.Shape, 'Rectangle', {
          fill: background,
          stroke: null,
          strokeWidth: 0,
          spot1: Gojs.Spot.TopLeft,
          spot2: Gojs.Spot.BottomRight
        }),
        $(
          Gojs.Panel,
          'Table',
          $(Gojs.TextBlock, typename, {
            row: 0,
            margin: 3,
            maxSize: new Gojs.Size(80, NaN),
            stroke: 'white',
            font: 'bold 11pt sans-serif'
          }),
          $(Gojs.Picture, icon, { row: 1, width: 55, height: 55 }),
          $(
            Gojs.TextBlock,
            {
              row: 2,
              margin: 3,
              editable: true,
              maxSize: new Gojs.Size(80, 40),
              stroke: 'white',
              font: 'bold 9pt sans-serif'
            },
            new Gojs.Binding('text', 'name').makeTwoWay()
          )
        )
      ),
      $(
        Gojs.Panel,
        'Vertical',
        {
          alignment: Gojs.Spot.Left,
          alignmentFocus: new Gojs.Spot(0, 0.5, -8, 0)
        },
        inports
      ),
      $(
        Gojs.Panel,
        'Vertical',
        {
          alignment: Gojs.Spot.Right,
          alignmentFocus: new Gojs.Spot(1, 0.5, 8, 0)
        },
        outports
      )
    );
    this.myDiagram.nodeTemplateMap.add(typename, node);
  }

  private makeTemplates() {

    this.makeTemplate(
      'Table',
      'images/55x55.png',
      'forestgreen',
      [],
      [this.makePort('OUT', false)]
    );

    this.makeTemplate(
      'Join',
      'images/55x55.png',
      '#ff9d00',
      [this.makePort('L', true), this.makePort('R', true)],
      [
        this.makePort('UL', false),
        this.makePort('ML', false),
        this.makePort('M', false),
        this.makePort('MR', false),
        this.makePort('UR', false)
      ]
    );

    this.makeTemplate(
      'Project',
      'images/55x55.png',
      'darkcyan',
      [this.makePort('', true)],
      [this.makePort('OUT', false)]
    );

    this.makeTemplate(
      'Filter',
      'images/55x55.png',
      'cornflowerblue',
      [this.makePort('', true)],
      [this.makePort('OUT', false), this.makePort('INV', false)]
    );

    this.makeTemplate(
      'Group',
      'images/55x55.png',
      'mediumpurple',
      [this.makePort('', true)],
      [this.makePort('OUT', false)]
    );

    this.makeTemplate(
      'Sort',
      'images/55x55.png',
      'sienna',
      [this.makePort('', true)],
      [this.makePort('OUT', false)]
    );

    this.makeTemplate(
      'Export',
      'images/55x55.png',
      'darkred',
      [this.makePort('', true)],
      []
    );

  }

  private save() {
    (<HTMLTextAreaElement> document.getElementById('mySavedModel')).value = this.myDiagram.model.toJson();
    this.myDiagram.isModified = false;
  }

  private load() {
    this.myDiagram.model = Gojs.Model.fromJson(
      (<HTMLTextAreaElement> document.getElementById('mySavedModel')).value
    );
  }
}
