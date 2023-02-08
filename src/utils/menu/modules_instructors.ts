import { module } from "@/stores/top-menu"

const modules_instructors: module[] = [
    {
        name: "Revisiones Monitores",
        icon: "UsersIcon",
        items: [
            {
                name: "Grupos",
                route: "groups.index",
                icon: "MinusIcon",
            },
            {
                name: "Inscripciones",
                route: "inscriptions.index",
                icon: "MinusIcon",
            },
            {
                name: "Pec",
                route: "pecs.index",
                icon: "MinusIcon",
            },
            {
                name: "Ficha metodológica de planeación",
                route: "methodologicalsheetsone.index",
                icon: "MinusIcon",
            },
            {
                name: "Ficha metodológica de evaluación",
                route: "methodologicalsheetstwo.index",
                icon: "MinusIcon",
            },
            {
                name: "Bitacora ensamble cultural",
                route: "culturalEnsembles.index",
                icon: "MinusIcon",
            },
            {
                name: "Bitacora circulación cultural",
                route: "culturalCirculations.index",
                icon: "MinusIcon",
            },
            ,
            {
                name: "Semillero cultural",
                route: "culturalSeedbeds.index",
                icon: "MinusIcon",
            },
        ]
    },
    {
        name: "Gestores",
        icon: "UsersIcon",
        items: [
            {
                name: "Mesa de dialogo",
                route: "dialoguetables.index",
                icon: "MinusIcon",
            },
            {
                name: "Instrucción metodológica",
                route: "methodologicalInstructions.index",
                icon: "MinusIcon",
            },
            {
                name: "Seguimiento de gestor cultural",
                route: "managermonitorings.index",
                icon: "MinusIcon",
            },
            {
                name: "Bitácora Jornada Pacto Gestor",
                route: "binnacleManagers.index",
                icon: "MinusIcon",
            },
        ]
    },
    {
        name: "Caracterización",
        icon: "LayersIcon",
        items: [
            {
                name: "Encuesta",
                route: "polls.index",
                icon: "MinusIcon",
            }
        ]
    }
]

export default modules_instructors