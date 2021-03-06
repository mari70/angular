import {ListWrapper, List} from 'angular2/src/facade/collection';
import {Injector} from 'angular2/di';
import {isPresent, isBlank} from 'angular2/src/facade/lang';

import * as avmModule from './view_manager';

import {ElementRef} from './element_ref';
import {ViewRef, ProtoViewRef, internalView} from './view_ref';
/**
 * @exportedAs angular2/core
 */
export class ViewContainerRef {
  _viewManager: avmModule.AppViewManager;
  _element: ElementRef;

  constructor(viewManager: avmModule.AppViewManager,
              element: ElementRef) {
    this._viewManager = viewManager;
    this._element = element;
  }

  _getViews() {
    var vc = internalView(this._element.parentView).viewContainers[this._element.boundElementIndex];
    return isPresent(vc) ? vc.views : [];
  }

  clear():void {
    for (var i = this.length - 1; i >= 0; i--) {
      this.remove(i);
    }
  }

  get(index: number): ViewRef {
    return new ViewRef(this._getViews()[index]);
  }

  get length() /* :int */ {
    return this._getViews().length;
  }

  // TODO(rado): profile and decide whether bounds checks should be added
  // to the methods below.
  create(protoViewRef:ProtoViewRef = null, atIndex:number=-1, injector:Injector = null): ViewRef {
    if (atIndex == -1) atIndex = this.length;
    return this._viewManager.createViewInContainer(this._element, atIndex, protoViewRef, injector);
  }

  insert(viewRef:ViewRef, atIndex:number=-1): ViewRef {
    if (atIndex == -1) atIndex = this.length;
    return this._viewManager.attachViewInContainer(this._element, atIndex, viewRef);
  }

  indexOf(viewRef:ViewRef) {
    return ListWrapper.indexOf(this._getViews(), internalView(viewRef));
  }

  remove(atIndex:number=-1):void {
    if (atIndex == -1) atIndex = this.length - 1;
    this._viewManager.destroyViewInContainer(this._element, atIndex);
    // view is intentionally not returned to the client.
  }

  /**
   * The method can be used together with insert to implement a view move, i.e.
   * moving the dom nodes while the directives in the view stay intact.
   */
  detach(atIndex:number=-1): ViewRef {
    if (atIndex == -1) atIndex = this.length - 1;
    return this._viewManager.detachViewInContainer(this._element, atIndex);
  }
}