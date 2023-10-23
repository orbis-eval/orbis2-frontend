/*
 * Props should always be per default required, if not, add a question mark after the prop name
 * Try to avoid optional props!
 * Default values should be set in the component itself with "withDefaults" function
 */

import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {ColorPalette} from "~/lib/model/colorpalette";
import {Corpus} from "~/lib/model/corpus";
import {Run} from "~/lib/model/run";
import {AnnotationType} from "~/lib/model/annotationType";

export interface IPaginationProps {
    currentPage: Number
    totalPages: Number
}

export interface IWarningProps {
    title: string
    message: string
    confirmText: string
    declineText: string
    onConfirm: Function
    onDecline: Function
}

export interface IAnnotationModalProps {
    leftPosition: Number
    topPosition: Number
    isVisible: boolean
    selectionSurfaceForm: string
    annotationTypes: AnnotationType[]
}

export interface IAnnotationNodeProps {
    nestedSetNode: NestedSetNode
    colorPalette: ColorPalette
    highlightedNestedSetNodeId: Number
    visibilityMap?: Object
}

export interface IDocumentAnnotationProps {
    highlightedNestedSetNodeId: Number
}

export interface IDocumentSidebarProps {
    loading: boolean
}

export interface IDeleteCorpusProps {
    /**
     * propsObject is being used by Modal component
     */
    propsObject: Corpus
}

export interface IDeleteRunProps {
    /**
     * propsObject is being used by Modal component
     */
    propsObject: Run
}

export interface IButtonProps {
    disabled?: boolean
    active?: boolean
    transparent?: boolean
    size?: string
    join?: boolean
    isFormButton?: boolean
    onClick: Function
}