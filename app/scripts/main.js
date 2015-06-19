'use strict';

var idDoctor;

$(document).ready(function() {

    var miTabla = $('#miTabla').DataTable({
        'paging': true,
        'searching': true,
        'processing': true,
        'serverSide': true,
        'language': {
            'sProcessing': 'Procesando...',
            'sLengthMenu': 'Mostrar _MENU_ registros',
            'sZeroRecords': 'No se encontraron resultados',
            'sEmptyTable': 'Ningún dato disponible en esta tabla',
            'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
            'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
            'sInfoPostFix': '',
            'sSearch': 'Buscar:',
            'sUrl': '',
            'sInfoThousands': ',',
            'sLoadingRecords': 'Cargando...',
            'oPaginate': {
                'sFirst': 'Primero',
                'sLast': 'Último',
                'sNext': 'Siguiente',
                'sPrevious': 'Anterior'
            },
            'oAria': {
                'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                'sSortDescending': ': Activar para ordenar la columna de manera descendente'
            }
        },
        //'ajax': 'php/cargar_vista.php',
        'ajax': 'http://localhost/futbolistas/cargar_vista.php',
        'columns': [{
            'data': 'nombre'
        }, {
            'data': 'numcolegiado'
        }, {
            'data': 'id_clinicas',
        }, {
            'data': 'nombreclinicas',
            'render': function(data) {
                return '<li>' + data + '</li><br>';
            }
        }, {
            'data': 'id_doctor',

            'render': function(data) {
                //return '<a class="btn btn-primary editarbtn" href=http://localhost/php/modificar_clinica.php?id_doctor=' + data + '>Editar</a>';
                return '<a class="btn btn-primary editarbtn" href=http://localhost/futbolistas/modificar_clinica.php?id_doctor=' + data + '>Editar</a>';
            }
        }, {
            'data': 'idDoctor',

            'render': function(data) {
                //return '<a data-toggle="modal" data-target="#basicModal"  class="btn btn-warning borrarbtn" href=http://localhost/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>';
                return '<a data-toggle="modal" data-target="#basicModal"  class="btn btn-warning borrarbtn" href=http://localhost/futbolistas/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>';
            }

        }]
    });






    //editar
    $('#miTabla').on('click', '.editarbtn', function(e) {
        e.preventDefault();

        $('#tabla').fadeOut(100);
        $('#formulario').fadeIn(100);

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idDoctor').val(aData.idDoctor);
        $('#nombre').val(aData.nombre);
        $('#numcolegiado').val(aData.numcolegiado);
        $('#clinicas').val(aData.nombreclinicas);

        // cargarTarifas();
        var str = aData.id_clinicas;
        str = str.split(',');
        $('#clinicas').val(str);
    });

    $('#enviar').click(function(e) {
        e.preventDefault();


        var datos = $('#formEditar').serialize();

        window.alert(datos);
        $.ajax({
                url: 'http://www.futbolistas.com/editar_doctores.php',
                type: 'POST',
                dataType: 'json',
                data: datos,

            })
            .done(function() {
                var $mitabla = $('#miTabla').dataTable({
                    bRetrieve: true
                });
                $mitabla.fnDraw();
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                $('#tabla').fadeIn(100);
                $('#formulario').fadeOut(100);
            });


    });


    //borrar
    $('#miTabla').on('click', '.borrarbtn', function(e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        idDoctor = aData.idDoctor;
    });

    $('#basicModal').on('click', '#confBorrar', function(e) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'php/borrar_doctor.php',
            url: 'http://localhost/futbolistas/borrar_doctor.php',
            data: {
                id_doctor: idDoctor
            },
            error: function(xhr, status, error) {


                alert('ERROR AL BORRAR DOCTOR');

            },
            success: function(data) {
                var $mitabla = $('#miTabla').dataTable({
                    bRetrieve: true
                });
                $mitabla.fnDraw();

                alert('DOCTOR BORRADO CORRECTAMENTE');

            },
            complete: {

            }
        });
        $('#tabla').fadeIn(100);
    });







    //añadir doctor
    $('#newdoctor').click(function(e) {
        e.preventDefault();

        //oculto tabla muestro form
        $('#tabla').fadeOut(100);
        $('#formularioCrear').fadeIn(100);
        cargarClinicaCrear();
    });




    //cargar clinica
    function cargarClinicaCrear() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'php/listar_tarifas.php',
            url: 'http://localhost/futbolistas/listar_tarifas.php',
            async: false,
            error: function(xhr, status, error) {},
            success: function(data) {
                $('#clinicas2').empty();
                $.each(data, function() {
                    $('#clinicas2').append(
                        $('<option ></option>').val(this.id_clinicas).html(this.nombre)
                    );
                });
            },
            complete: {}
        });
    }





    // function cargarTarifas() {
    //     $.ajax({
    //         type: 'POST',
    //         dataType: 'json',
    //         //url: 'php/listar_tarifas.php',
    //         url: 'http://localhost/futbolistas/listar_tarifas.php',
    //         async: false,
    //         error: function(xhr, status, error) {},
    //         success: function(data) {
    //             $('#clinicas').empty();
    //             $.each(data, function() {
    //                 $('#clinicas').append(
    //                     $('<option ></option>').val(this.id_clinicas).html(this.nombre)
    //                 );
    //             });
    //         },
    //         complete: {

    //         }
    //     });

    // }

});
