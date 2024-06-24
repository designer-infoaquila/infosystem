'use strict';

var KTDatatablesDataSourceAjaxServer = (function () {
	var initTable1 = function () {
		var table = $('#kt_datatable').DataTable({
			language: {
				url: '../../assets/js/Portuguese-Brasil.json',
			},
			responsive: true,
			processing: true,
			serverSide: true,
			ajax: HOST_URL + 'cadastros/vendedor/ajax.php',
			order: [[1, 'asc']],
			columnDefs: [
				{
					targets: 0,
					width: '30px',
					className: 'text-center',
					orderable: false,
				},
				{

					className: 'text-center',
					targets: -2,
					title: 'Status',
					orderable: false,
					render: function (data, type, row) {

						if (data == 1) {
							return '<span class="label label-lg font-weight-bold label-light-success label-inline">Ativo</span>';
						} else {
							return '<span class="label label-lg font-weight-bold label-light-danger label-inline">Inativo</span>';
						}

					},
				},
				{
					width: '100px',
					className: 'text-center',
					targets: -1,
					title: 'Ações',
					orderable: false,
					render: function (data, type, row) {
						if (row[6] == 1) {
							var btn_status = '<a href="#" class="btn btn-sm btn-clean btn-icon desativar" id="' + data + '" title="Desativar">\
													<i class="la la-times-circle"></i>\
												</a>';
						} else {
							var btn_status = '<a href="#" class="btn btn-sm btn-clean btn-icon ativar" id="' + data + '" title="Ativar">\
													<i class="la la-check-circle"></i>\
												</a>';
						}

						return (btn_status + '<a href="edit?id=' + data + '" class="btn btn-sm btn-clean btn-icon" title="Editar">\
									<i class="la la-edit"></i>\
								</a>\
								<a href="javascript:;" class="btn btn-sm btn-clean btn-icon remover" title="Remover" id="' + data + '">\
									<i class="la la-trash"></i>\
								</a>');
					},
				},
			],
		});
	};
	return {
		//main function to initiate the module
		init: function () {
			initTable1();
		},
	};
})();

jQuery(document).ready(function () {
	KTDatatablesDataSourceAjaxServer.init();

	$('.menu-item-submenu:nth-child(1)').addClass('menu-item-open menu-item-here');
	$('.menu-cadastros .menu-item:nth-child(2)').addClass('menu-item-active');

	$(document).on('click', '.remover', function (e) {
		e.preventDefault();
		var id = $(this).attr('id');
		Swal.fire({
			title: 'Deseja remover?',
			html: '',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sim, remover!',
			cancelButtonText: 'Não, cancelar!',
		}).then((result) => {
			if (result.value) {
				$.ajax({
					url: HOST_URL + 'cadastros/vendedor/sql.php',
					type: 'POST',
					data: {
						type: 'vendedor_remove',
						id: id,
					},
					success: function (data, status) {
						//console.log(data);
						var resposta = data.split('||');
						if (resposta[0] == 'success') {
							Swal.fire({
								title: 'Removido!',
								text: 'Vendedor removido com sucesso!',
								icon: 'success',
								timer: 1000,
								onOpen: function () {
									Swal.showLoading();
								},
							}).then(function (result) {
								$('#kt_datatable').DataTable().ajax.reload(null, false);
							});
						} else {
							Swal.fire({
								html: resposta[1],
								icon: 'error',
								buttonsStyling: false,
								confirmButtonText: 'OK, entendi!',
								customClass: {
									confirmButton: 'btn font-weight-bold btn-primary',
								},
							});
						}
					},
				});
			}
		});
	});

	$(document).on('click', '.ativar', function (e) {
		e.preventDefault();
		var id = $(this).attr('id');
		Swal.fire({
			title: 'Deseja ativar o vendedor?',
			html: "",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sim, ativar!',
			cancelButtonText: 'Não, cancelar!'
		}).then((result) => {
			if (result.value) {
				$.ajax({
					url: 'sql.php',
					type: 'POST',
					data: {
						type: "ativar",
						id: id
					},
					success: function (data, status) {
						var resposta = data.split("||");
						if (resposta[0] == 'success') {
							$('#kt_datatable').DataTable().ajax.reload();
						} else {
							Swal.fire({
								html: resposta[1],
								icon: "error",
								buttonsStyling: false,
								confirmButtonText: "OK, entendi!",
								customClass: {
									confirmButton: "btn font-weight-bold btn-primary",
								}
							});
						}
					}
				});
			}
		});
	});
	$(document).on('click', '.desativar', function (e) {
		e.preventDefault();
		var id = $(this).attr('id');
		Swal.fire({
			title: 'Deseja desativar o vendedor?',
			html: "",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sim, desativar!',
			cancelButtonText: 'Não, cancelar!'
		}).then((result) => {
			if (result.value) {
				$.ajax({
					url: 'sql.php',
					type: 'POST',
					data: {
						type: "desativar",
						id: id
					},
					success: function (data, status) {
						console.log(data);
						var resposta = data.split("||");
						if (resposta[0] == 'success') {
							$('#kt_datatable').DataTable().ajax.reload();
						} else {
							Swal.fire({
								html: resposta[1],
								icon: "error",
								buttonsStyling: false,
								confirmButtonText: "OK, entendi!",
								customClass: {
									confirmButton: "btn font-weight-bold btn-primary",
								}
							});
						}
					}
				});
			}
		});
	});
});