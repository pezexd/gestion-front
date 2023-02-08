import mixins from "./mixins"

const { is_role } = mixins.computed

const super_admin = () => { return (is_role('super.root') || is_role('root')) }

export default {
    // Monitors
    inscriptions: {
        create: () => { return (is_role('monitor_cultural') || is_role('instructor') || super_admin()) },
        management: () => { return (is_role('apoyo_seguimiento_monitoreo') || super_admin()) },
        crud_management: () => { return (is_role('apoyo_seguimiento_monitoreo')) },
        no_edit: () => { return (is_role('apoyo_seguimiento_monitoreo')) }
    },
    binnacles: {
        create: () => { return (is_role('monitor_cultural') || is_role('instructor') || is_role('embajador') || super_admin()) },
        management: () => { return (is_role('apoyo_seguimiento_monitoreo') || is_role('gestores_culturales') || is_role('lider_instructor') || is_role('lider_embajador') || super_admin()) },
        crud_management: () => { return (is_role('apoyo_seguimiento_monitoreo') || is_role('gestores_culturales') || is_role('lider_instructor') || is_role('lider_embajador')) },
        no_edit: () => { return (is_role('apoyo_seguimiento_monitoreo') || is_role('lider_instructor') || is_role('lider_embajador') || is_role('gestores_culturales')) }
    },
    pecs: {
        create: () => { return (is_role('monitor_cultural') || is_role('instructor') || super_admin()) },
        management: () => { return (is_role('gestores_culturales') || is_role('lider_instructor') || super_admin()) },
        crud_management: () => { return (is_role('gestores_culturales') || is_role('lider_instructor')) },
        no_edit: () => { return (is_role('gestores_culturales') || is_role('lider_instructor')) }
    },
    pedagogicals: {
        create: () => { return (is_role('monitor_cultural') || is_role('instructor') || super_admin()) },
        management: () => { return (is_role('gestores_culturales') || is_role('lider_instructor') || super_admin()) },
        crud_management: () => { return (is_role('gestores_culturales') || is_role('lider_instructor')) },
        no_edit: () => { return (is_role('gestores_culturales') || is_role('lider_instructor')) }
    },
    // Gestors
    dialoguetables: {
        create: () => { return (is_role('gestores_culturales') || super_admin()) },
        management: () => { return (is_role('apoyo_metodologico') || super_admin()) },
        crud_management: () => { return (is_role('apoyo_metodologico')) },
        no_edit: () => { return (is_role('apoyo_metodologico')) }
    },
    binnaclesManagers: {
        create: () => { return (is_role('gestores_culturales') || super_admin()) },
        management: () => { return (is_role('apoyo_metodologico') || is_role('apoyo_seguimiento_monitoreo') || super_admin()) },
        crud_management: () => { return (is_role('apoyo_metodologico')) || is_role('apoyo_seguimiento_monitoreo') },
        no_edit: () => { return (is_role('apoyo_metodologico')) }
    },
    methodologicalInstructions: {
        create: () => { return (is_role('gestores_culturales') || super_admin()) },
        management: () => { return (is_role('apoyo_metodologico') || super_admin()) },
        crud_management: () => { return (is_role('apoyo_metodologico')) },
        no_edit: () => { return (is_role('apoyo_metodologico')) }
    },
    managermonitorings: {
        create: () => { return (is_role('gestores_culturales') || super_admin()) },
        management: () => { return (is_role('apoyo_metodologico') || super_admin()) },
        crud_management: () => { return (is_role('apoyo_metodologico')) },
        no_edit: () => { return (is_role('apoyo_metodologico')) }
    },
    // Psychosocial
    parentschools: {
        create: () => { return (is_role('psicosocial') || is_role('coordinador_psicosocial') || super_admin()) },
        management: () => { return (is_role('coordinador_psicosocial') || super_admin()) },
        crud_management: () => { return (is_role('coordinador_psicosocial')) },
        no_edit: () => { return (is_role('coordinador_psicosocial')) }
    },
    psychosocialinstructions: {
        create: () => { return (is_role('psicosocial') || is_role('coordinador_psicosocial') || super_admin()) },
        management: () => { return (is_role('coordinador_psicosocial') || super_admin()) },
        crud_management: () => { return (is_role('coordinador_psicosocial')) },
        no_edit: () => { return (is_role('coordinador_psicosocial')) }
    },
    psychopedagogicallogs: {
        create: () => { return (is_role('psicosocial') || is_role('coordinador_psicosocial') || super_admin()) },
        management: () => { return (is_role('coordinador_psicosocial') || super_admin()) },
        crud_management: () => { return (is_role('coordinador_psicosocial')) },
        no_edit: () => { return (is_role('coordinador_psicosocial')) }
    },
    coord_superv: {
        create: () => { return (is_role('coordinador_supervision') || is_role('coordinador_seguimiento') || is_role('coordinador_metodologico') || is_role('coordinador_administrativo') || is_role('coordinador_psicosocial') || super_admin()) },
        management: () => { return (is_role('subdireccion') || super_admin()) },
        crud_management: () => { return is_role('subdireccion') },
        no_edit: () => { return (is_role('subdireccion')) }
    },
    subdireccion: {
        create: () => { return (is_role('subdireccion') || super_admin()) },
        management: () => { return (is_role('subdireccion') || super_admin()) },
        crud_management: () => { return (is_role('subdireccion')) },
        no_edit: () => { return (is_role('subdireccion')) }
    }
    // template: {
    //     create: () => { return (super_admin()) },
    //     management: () => { return (super_admin()) },
    // crud_management: () => { return (is_role('')) },
    //     no_edit: () => { return (super_admin()) }
    // }
}