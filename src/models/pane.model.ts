import { Buffer, NullBuffer } from "./buffer.model"
import { v4 as uuidv4 } from 'uuid';


export class Pane {
    id: string = uuidv4()
    parentNode: Pane | null = null
    leftPane: Pane | null = null
    rightPane: Pane | null = null
    buffer: Buffer = new NullBuffer()
    split: PaneSplit = PaneSplit.Null
}

export class PaneJson {
    id: string = uuidv4()
    parentNodeId = ''
    buffer: Buffer = new NullBuffer()
    split: PaneSplit = PaneSplit.Null
    leftPane: PaneJson | null = null
    rightPane: PaneJson | null = null
}

export enum PaneSplit {
    Vertical,
    Horizontal,
    Null
}

export class NullPane extends Pane { }