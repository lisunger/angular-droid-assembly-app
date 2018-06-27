import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayResult } from '../../data-models/ebay-result.model';
import { EbayItem } from '../../data-models/ebay-item';
import { Project } from '../../data-models/project';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import * as Gojs from 'gojs';
import { MyComponent } from '../../data-models/my-component';
import { Scheme } from '../../data-models/Scheme';

@Component({
  selector: 'nk-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProjectComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private ebayService: EbayHttpService,
    private databaseService: ProjectsDatabaseService,
    private router: Router
  ) {}

  public searchTerm = '';
  public resultData;
  public resultCount: number;
  public parsedData: EbayResult;
  public selectedItems: EbayItem[] = [];
  public draggedItem: EbayItem;
  public currentProject: Project;
  public msgs: Message[];
  public dialogDisplay = false;
  public currentComponent: MyComponent = new MyComponent();
  public iPort;
  public oPort;
  public myDiagram;

  ngOnInit() {
    this.currentProject = new Project();
    this.initGraph();
    this.buildScheme();
  }

  paginate(event): void {
    if (this.searchTerm !== undefined && this.searchTerm.length > 0) {
      this.ebayService
        .searchItemByKeywords(this.searchTerm, event.rows, event.page + 1)
        .subscribe(res => {
          this.resultData = res;
          this.parseResultData();
        });
    }
  }

  private parseResultData(): void {
    this.parsedData = new EbayResult(this.resultData);
    this.resultCount = this.parsedData.resultCount;
  }

  dragStart(event, item: EbayItem) {
    this.draggedItem = item;
  }

  dragEnd(event) {
    this.draggedItem = null;
  }

  drop(event) {
    this.selectedItems.push(this.draggedItem);
  }

  removeSelected(index) {
    this.selectedItems.splice(index, 1);
  }

  submitProject() {
    this.currentProject.date = new Date();
    this.currentProject.authorId = this.authService.getUserId();
    this.currentProject.partsIds = [];
    this.currentProject.rating = 0;
    this.selectedItems.forEach(i =>
      this.currentProject.partsIds.push(i.itemId)
    );
    this.currentProject.schematic = this.myDiagram.model.toJson();

    this.databaseService.postProject(this.currentProject).subscribe(
      res => {
        window.scrollTo(0, 0);
        this.setSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 2500);
      },
      err => {
        window.scrollTo(0, 0);
        this.setErrorMessage();
      }
    );
  }

  setSuccessMessage() {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Project saved' });
  }

  setErrorMessage() {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: 'Error',
      detail: 'Your project could not be saved'
    });
  }

  createPart() {
    this.dialogDisplay = !this.dialogDisplay;
  }

  submitComponent() {
    if (this.currentComponent.name) {
      this.currentProject.componentsList.push(this.currentComponent);
    }
    this.currentComponent = new MyComponent();
    this.dialogDisplay = false;
  }

  cancelComponent() {
    this.currentComponent = new MyComponent();
    this.dialogDisplay = false;
  }

  test() {
    console.log(this.currentProject);
  }

  // GoJs methods
  private initGraph() {
    let $ = Gojs.GraphObject.make;
    this.myDiagram = $(Gojs.Diagram, 'myDiagramDiv', {
      initialContentAlignment: Gojs.Spot.Left,
      initialAutoScale: Gojs.Diagram.UniformToFill,
      layout: $(Gojs.LayeredDigraphLayout, { direction: 0 }),
      'undoManager.isEnabled': true
    });

    this.myDiagram.addDiagramListener('Modified', e => {
      console.log('modified');
      this.currentProject.schematic = this.myDiagram.model.toJson();
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

    // this.makeTemplates();
    // this.load();
  }

  buildScheme() {
    // first reset scheme
    this.currentProject.schematic = new Scheme();

    let index = 0;
    this.currentProject.componentsList.forEach(c => {
      console.log(c);
      let I = [];
      c.inPorts.forEach(i => {
        console.log('Creating IN port', i);
        I.push(this.makePort(i, true));
      });
      let O = [];
      c.outPorts.forEach(o => {
        console.log('Creating OUT port', o);
        O.push(this.makePort(o, false));
      });
      console.log(I);
      console.log(O);
      this.makeTemplate(c.name, c.imageUrl, c.color, I, O);
      this.currentProject.schematic.nodeDataArray.push({
        key: index++,
        type: c.name
      });
    });

    this.myDiagram.model = Gojs.Model.fromJson(
      JSON.stringify(this.currentProject.schematic)
    );
    console.log(this.myDiagram.model.toJson());
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

  private makePort(name, leftside) {
    let $ = Gojs.GraphObject.make;
    let port = $(Gojs.Shape, 'Rectangle', {
      fill: 'gray',
      stroke: null,
      desiredSize: new Gojs.Size(8, 8),
      portId: name, // declare this object to be a "port"
      toMaxLinks: 10, // don't allow more than one link into a port
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

  saveChanges() {
    console.log('change!');
    this.currentProject.schematic = this.myDiagram.model.toJson();
  }

  clearScheme() {
    this.currentProject.schematic = new Scheme();
    this.myDiagram.model = Gojs.Model.fromJson(
      JSON.stringify(this.currentProject.schematic)
    );
  }
}
