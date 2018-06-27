import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../data-models/project';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayItem } from '../../data-models/ebay-item';
import { AuthService } from '../../services/auth.service';
import { Comment as ProjectComment } from '../../data-models/comment';
import * as Gojs from 'gojs';

@Component({
  selector: 'nk-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDetailsComponent implements OnInit {

  constructor(
    private databaseService: ProjectsDatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private ebayService: EbayHttpService,
    private authService: AuthService) { }

  private projectId;
  project: Project = new Project();
  parts: EbayItem[] = [];
  newComment = '';
  comments: ProjectComment[] = [];
  authorName = 'unknown';
  myDiagram;

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.loadProject();
    this.loadComments();
  }

  private loadProject() {
    this.databaseService.getProject(this.projectId)
      .subscribe(res => {
        this.project = res;
        this.loadItems();
        this.loadAuthorName();
        this.initGraph();
      }, (error) => {
        this.router.navigate(['/**']);
      });
  }

  private loadItems() {
    this.project.partsIds.forEach(i => {
      this.ebayService.searchItemById(i)
        .subscribe(res => {
          this.parts.push(new EbayItem(res['findItemsByKeywordsResponse'][0]['searchResult'][0]['item'][0]));
        });
    });
  }

  private loadComments() {
    this.databaseService.getCommentsByProjectId(this.projectId)
      .subscribe(res => {
          res['data'].forEach(element => {
          this.comments.push(<ProjectComment> element);
          this.loadCommentsAuthors();
        });
      });
  }

  loadCommentsAuthors() {
    this.comments.forEach(c => {
      this.databaseService.getUserameById(c.authorId)
        .subscribe(res => {
          c['userName'] = res['data'];
        });
    });
  }

  loadAuthorName() {
    this.databaseService.getUserameById(this.project.authorId)
      .subscribe(res => {
        this.authorName = res['data'];
      });
  }

  submitComment() {
    let comment: ProjectComment = {
      authorId: this.authService.getUserId(),
      projectId: this.projectId,
      content: this.newComment.trim(),
      date: new Date()
    };
    this.databaseService.postComment(comment)
      .subscribe(res => {
        this.newComment = '';
        let newComment: ProjectComment = res['data'];
        newComment['userName'] = this.authService.getUsername();
        this.comments.push(newComment);
      }, this.handleError);
    }

  private handleError(error) {
    console.log(error);
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
    this.myDiagram.model = Gojs.Model.fromJson(this.project.schematic);
  }

  private makeTemplates() {
    this.project.componentsList.forEach(c => {

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
      this.makeTemplate(c.name, c.imageUrl, c.color, I, O);
    });
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

}
