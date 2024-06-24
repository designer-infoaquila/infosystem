'use strict';

// Class definition
var KTpedidoAdd = (function () {
	// Base elements
	var _wizardEl;
	var _formEl;
	var _wizardObj;
	var _validations = [];

	// Private functions
	var _initWizard = function () {
		// Initialize form wizard
		_wizardObj = new KTWizard(_wizardEl, {
			startStep: 1, // initial active step number
			clickableSteps: false, // allow step clicking
		});

		// Change event
		_wizardObj.on('changed', function (wizard) {
			KTUtil.scrollTop();
		});

		// Submit event
		_wizardObj.on('submit', function (wizard) {
			var validator = _validations[0];

			if (validator) {

				validator.validate().then(function (status) {
					if (status == 'Valid') {
						var data = new FormData();

						//Form data
						var form_data = $('#pedido_add_form').serializeArray();
						$.each(form_data, function (key, input) {
							data.append(input.name, input.value);
						});

						$.ajax({
							url: HOST_URL + 'vendas/pedido/sql.php',
							type: 'POST',
							data: data,
							processData: false,
							contentType: false,
							success: function (data, status) {
								//console.log(data);
								var resposta = data.split('||');
								if (resposta[0] == 'success') {
									Swal.fire({
										title: 'Inserido!',
										text: 'Orçamento inserido com sucesso',
										icon: 'success',
										timer: 1000,
										onOpen: function () {
											Swal.showLoading();
										},
									}).then(function (result) {
										window.location.href = HOST_URL + 'vendas/pedido';
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
							error: function (xhr, desc, err) {
								Swal.fire({
									html: 'Orçamento não foi inserido!',
									icon: 'error',
									buttonsStyling: false,
									confirmButtonText: 'OK, entendi!',
									customClass: {
										confirmButton: 'btn font-weight-bold btn-primary',
									},
								});
							},
						});
					} else {
					}
				});
			}
		});
	};

	var _initValidation = function () {
		_validations.push(
			FormValidation.formValidation(_formEl, {
				fields: {
					codigo: {
						validators: {
							notEmpty: {
								message: 'Codigo é Necessário',
							},

						},
					},


				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap({
						//eleInvalidClass: '',
						eleValidClass: '',
					}),
				},
			})
		);
	};

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('pedido_add');
			_formEl = KTUtil.getById('pedido_add_form');

			_initWizard();
			_initValidation();
		},
	};
})();
var KTpagamentoAdd = (function () {
	// Base elements

	// Private functions
	var _initWizard = function () {
		// Initialize form wizard

		// Submit event
		$(document).on('click', '.add-pagamento', function (e) {
			e.preventDefault();
			$('.action-hidden').hide();

			var forma = $('select[name="forma"]').val();
			var prazo = $('select[name="prazo"]').val();
			var valor = $('input[name="valor"]').val();
			var id_pedido = $('input[name="id_pedido"]').val();

			if (forma != '' || prazo != '' || valor != '') {

				$.ajax({
					url: HOST_URL + 'vendas/pedido/sql.php',
					type: 'POST',
					data: {
						forma: forma,
						prazo: prazo,
						valor: valor,
						type: "pagamento_add",
						id_pedido: id_pedido
					},
					success: function (data, status) {

						var resposta = data.split('||');
						if (resposta[0] == 'success') {
							Swal.fire({
								title: 'Inserido!',
								text: 'Prazo de Pagamento inserido com sucesso no Pedido.',
								icon: 'success',
								timer: 1000,
								onOpen: function () {
									Swal.showLoading();
								},
							}).then(function (result) {
								$('.action-hidden').show();

								$('#kt_datatable_pagamento').DataTable().ajax.reload(null, false);

								$('select[name="forma"]').val('');
								$('select[name="prazo"]').val('');
								$('input[name="valor"]').val('');
							});
						} else {
							$('.action-hidden').show();

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
					error: function (xhr, desc, err) {
						$('.action-hidden').show();

						Swal.fire({
							html: 'O Prazo de Pagamento não foi adicionado!',
							icon: 'error',
							buttonsStyling: false,
							confirmButtonText: 'OK, entendi!',
							customClass: {
								confirmButton: 'btn font-weight-bold btn-primary',
							},
						});
					},
				});
			} else {
				$('.action-hidden').show();

				Swal.fire({
					html: 'Preencha todos os campos do pagamento, para Adicionar!',
					icon: 'error',
					buttonsStyling: false,
					confirmButtonText: 'OK, entendi!',
					customClass: {
						confirmButton: 'btn font-weight-bold btn-primary',
					},
				});
			}

		});
	};

	return {
		// public functions
		init: function () {

			_initWizard();
		},
	};
})();
var KTSelect2 = function () {
	// Private functions
	var demos = function () {
		// basic
		$('#transportadora').select2({
			placeholder: "Selecione a Transportadora",
			ajax: {
				url: HOST_URL + 'vendas/pedido/transportadora.php',
				dataType: "json",
				type: "GET",
				data: function (params) {

					var queryParameters = {
						term: params.term
					}
					return queryParameters;
				},
				processResults: function (data) {
					return {
						results: $.map(data, function (item) {
							return {
								text: item.itemName,
								id: item.id
							}
						})
					};
				}
			}
		});
		$('#cliente').select2({
			placeholder: "Selecione o Cliente",
			ajax: {
				url: HOST_URL + 'vendas/pedido/cliente.php',
				dataType: "json",
				type: "GET",
				data: function (params) {

					var queryParameters = {
						term: params.term
					}
					return queryParameters;
				},
				processResults: function (data) {
					return {
						results: $.map(data, function (item) {
							return {
								text: item.itemName,
								id: item.id
							}

						})
					};
				}
			}
		});
		$('#vendedor').select2({
			placeholder: "Selecione o Vendedor",
			ajax: {
				url: HOST_URL + 'vendas/pedido/vendedor.php',
				dataType: "json",
				type: "GET",
				data: function (params) {

					var queryParameters = {
						term: params.term
					}
					return queryParameters;
				},
				processResults: function (data) {
					return {
						results: $.map(data, function (item) {
							return {
								text: item.itemName,
								id: item.id
							}

						})
					};
				}
			}
		});

	}

	// Public functions
	return {
		init: function () {
			demos();
		}
	};
}();
var KTDatatablePagamentoServer = (function () {
	return {
		//main function to initiate the module
		init: function () {
			var id_pedido = $('input[name="id_pedido"').val();
			// alert(id_material);

			var table = $('#kt_datatable_pagamento').DataTable({
				info: false,
				ordering: false,
				paging: false,
				searching: false,
				language: {
					url: '../../assets/js/Portuguese-Brasil.json',
				},
				responsive: true,
				processing: true,
				serverSide: true,
				autoWidth: false,
				ajax: HOST_URL + 'vendas/pedido/pagamento.ajax.php?id_pedido=' + id_pedido,
				columnDefs: [
					{
						targets: 2,
						render: function (data, type, row) {
							return 'R$ ' + data.replaceAll('.', ',');
							// return ('R$ ' + data.toFixed(2).replaceAll('.', ','));
						},
					},
					{
						width: '30px',
						className: 'text-center',
						targets: -1,
						title: 'Ações',
						orderable: false,
						render: function (data, type, row) {

							return ('<a href="javascript:;" class="btn btn-sm btn-clean btn-icon remover-pagamento" title="Remover" id="' + data + '">\
										<i class="la la-trash"></i>\
									</a>');
						},
					},
				],
				footerCallback: function (row, data, start, end, display) {
					var api = this.api(),
						data;

					// Total over this page
					var pageTotal_qtd = api
						.column(2, {
							page: 'current',
						})
						.data()
						.reduce(function (a, b) {
							return moedaParaNumero(a) + moedaParaNumero(b);
						}, 0);
					// Update footer
					$(api.column(1).footer()).html('<b>Total</b>');
					$(api.column(2).footer()).html('<b>R$ ' + pageTotal_qtd.toFixed(2).replaceAll('.', ',') + '</b>');
				},
			});
		},
	};
})();
var KTDatatablemateriaisServer = (function () {
	var initTable2 = function () {
		var table = $('#kt_datatable_materiais').DataTable({
			pageLength: 5,
			lengthMenu: [
				[5, 10, 20, -1],
				[5, 10, 20, 'Todos'],
			],
			language: {
				url: '../../assets/js/Portuguese-Brasil.json',
			},
			//info: false,
			responsive: true,
			processing: true,
			serverSide: true,
			autoWidth: false,
			ajax: HOST_URL + 'vendas/pedido/materiais.php',
			order: [[0, 'asc']],
			columnDefs: [
				{
					targets: 0,
					width: '70px',
				},
				{
					targets: 2,
					width: '70px',
				},
				{
					className: 'text-center',
					targets: -1,
					title: 'Ações',
					orderable: false,
					width: '35px',
					render: function (data, type, row) {
						return (
							'<a href="javascript:;" class="btn btn-sm btn-clean btn-icon listaProduto" data-toggle="modal" data-target="#listaMateriais" title="Incluir" id="' + data + '">\
								<i class="la la-check-circle"></i>\
							</a>'
						);
					},
				},
			],
		});

		$(document).on('click', '.listaProduto', function (e) {

			var id_r_produto = $(this).attr('id');
			// $("#id_r_produto").val(id_r_produto);

			var table = $('#kt_datatable_estoque').DataTable({
				pageLength: 12,
				/*lengthMenu: [
					[10, 10, 20, -1],
					[10, 10, 20, 'Todos'],
				],*/
				language: {
					url: '../../assets/js/Portuguese-Brasil.json',
				},
				//info: false,
				retrieve: true,
				responsive: true,
				processing: true,
				serverSide: true,
				autoWidth: false,
				paging: false,
				ajax: HOST_URL + 'vendas/pedido/estoques.php?id=' + id_r_produto,
				order: [[1, 'asc']],
				columnDefs: [
					{
						targets: 0,
						width: '30px',
						orderable: false
					},

				],
			});

			$(document).on('click', '.close-produtos', function (e) {
				// $('#kt_datatable_estoque').DataTable().destroy();
				table.destroy();
			});

		});


	};
	return {
		//main function to initiate the module
		init: function () {
			initTable2();
		},
	};
})();

function moedaParaNumero(valor) {
	return isNaN(valor) == false ? parseFloat(valor) : parseFloat(valor.replaceAll('.', '').replace(',', '.'));
}
function numeroParaMoeda(n, c, d, t, s, i, j) {
	(c = isNaN((c = Math.abs(c))) ? 2 : c), (d = d == undefined ? ',' : d), (t = t == undefined ? '.' : t), (s = n < 0 ? '-' : ''), (i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + ''), (j = (j = i.length) > 3 ? j % 3 : 0);
	return (
		s +
		(j ? i.substr(0, j) + t : '') +
		i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
		(c
			? d +
			Math.abs(n - i)
				.toFixed(c)
				.slice(3)
			: '')
	);
}

jQuery(document).ready(function () {
	KTpedidoAdd.init();
	KTpagamentoAdd.init();
	KTDatatablePagamentoServer.init();
	KTDatatablemateriaisServer.init();
	KTSelect2.init();

	/*  Temporario */

	var id_pedido = $('#id_pedido').val();

	$.ajax({
		url: '../pedido/sql.php',
		type: 'POST',
		dataType: 'html',
		data: {
			type: 'materiais_view',
			id_pedido: id_pedido,
		},
		success: function (data) {

			var resposta = data.split('||');

			$(".txt_total").html(resposta[2]);

			$("input[name='vl_produto']").val(resposta[1]);
			$("input[name='vl_total']").val(resposta[1]);

			$('.materiais').html(resposta[0]);
		},
	});

	/* Temporario */

	$('.menu-item-submenu:nth-child(4)').addClass('menu-item-open menu-item-here');
	$('.menu-vendas .menu-item:nth-child(2)').addClass('menu-item-active');

	$(document).on('click', '.remover-pagamento', function (e) {
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
					url: HOST_URL + 'vendas/pedido/sql.php',
					type: 'POST',
					data: {
						type: 'pagamento_remove',
						id: id,
						temp: '1'
					},
					success: function (data, status) {
						//console.log(data);
						var resposta = data.split('||');
						if (resposta[0] == 'success') {
							Swal.fire({
								title: 'Removido!',
								text: 'Pagamento removido com sucesso no Material.',
								icon: 'success',
								timer: 1000,
								onOpen: function () {
									Swal.showLoading();
								},
							}).then(function (result) {
								$('#kt_datatable_pagamento').DataTable().ajax.reload(null, false);
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

	$(document).on('click', '.add-produto', function (e) {
		e.preventDefault();

		var id_pedido = $('#id_pedido').val();

		Swal.fire({
			title: 'Deseja adicionar?',
			html: '',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sim, adicionar!',
			cancelButtonText: 'Não, cancelar!',
		}).then((result) => {
			if (result.value) {
				$.ajax({
					url: HOST_URL + 'vendas/pedido/sql.php',
					type: 'POST',
					data: {
						type: 'produto_add',
						id_pedido: id_pedido
					},
					success: function (data, status) {
						//console.log(data);
						var resposta = data.split('||');
						if (resposta[0] == 'success') {
							Swal.fire({
								title: 'Adicionado!',
								text: 'Produtos adicionado com sucesso no Pedido.',
								icon: 'success',
								timer: 1000,
								onOpen: function () {
									Swal.showLoading();
								},
							}).then(function (result) {

								var id_pedido = $('#id_pedido').val();

								$.ajax({
									url: '../pedido/sql.php',
									type: 'POST',
									dataType: 'html',
									data: {
										type: 'materiais_view',
										id_pedido: id_pedido,
									},
									success: function (data) {
										$('#listaMateriais').modal('toggle');
										$('#addProduto').modal('toggle');

										var resposta = data.split('||');

										$(".txt_total").html(resposta[2]);

										$("input[name='vl_produto']").val(resposta[1]);

										$('.materiais').html(resposta[0]);
									},
								});

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

	$(document).on('click', '#kt_search_materiais', function (e) {
		e.preventDefault();

		var params = {};

		$('.datatable-input-materiais').each(function () {
			var i = $(this).data('col-index');
			params[i] = $(this).val();
		});
		//console.log(params);
		$.each(params, function (i, val) {
			$('#kt_datatable_materiais')
				.DataTable()
				.column(i)
				.search(val ? val : '', false, false);
		});
		$('#kt_datatable_materiais').DataTable().table().draw();
	});

	$(document).on('click', '.zerar', function () {

		$('.datatable-input-materiais').val('');

		var params = {};

		$('.datatable-input-materiais').each(function () {
			var i = $(this).data('col-index');
			params[i] = $(this).val();
		});
		$.each(params, function (i, val) {
			$('#kt_datatable_materiais')
				.DataTable()
				.column(i)
				.search('', false, false);
		});
		$('#kt_datatable_materiais').DataTable().table().draw();

	});

	$(document).on('click', '.produtos', function () {

		var produtos = $(this).val();
		if ($(this).is(':checked')) {

			$.ajax({
				url: "sql.php",
				type: "POST",
				data: {
					type: 'produtos_session_add',
					produtos: produtos,
				}
			});
		} else {
			$.ajax({
				url: "sql.php",
				type: "POST",
				data: {
					type: 'produtos_session_remove',
					produtos: produtos,
				}
			});
		}

	});

	$('.selectAll').click(function (event) {
		if (this.checked) {

			$('.checkbox input').each(function () {
				this.checked = true;
			});

			var produtos = $(this).val();

			$.ajax({
				url: "sql.php",
				type: "POST",
				data: {
					type: 'produtos_session_add',
					produtos: produtos,
				}
			});


		} else {

			$('.checkbox input').each(function () {
				this.checked = false;
			});

			$.ajax({
				url: "sql.php",
				type: "POST",
				data: {
					type: 'produtos_session_remove_all',
				}
			});

		}
	});

	$(document).on('focusout', 'input[name=vl_desconto]', function (e) {

		if ($(this).val() != "") {
			var vl_desconto = moedaParaNumero($(this).val());
		} else {
			var vl_desconto = 0;
		}

		if ($('input[name=vl_outros]').val() != "") {
			var vl_outros = moedaParaNumero($('input[name=vl_outros]').val());
		} else {
			var vl_outros = 0;
		}

		if ($('input[name=vl_produto]').val() != "") {
			var vl_produto = moedaParaNumero($('input[name=vl_produto]').val());
		} else {
			var vl_produto = 0;
		}


		var novo = vl_produto - vl_desconto + vl_outros;

		$('input[name=vl_total]').val(novo);
		$('.txt_total').html('<div class="mr-5 text-right" style="line-height: 1.25;">\
				<span>Total do Pedido</span><br>\
				<span style="font-weight: 800;font-size: 22px;">R$ ' + novo.toFixed(2).replaceAll('.', ',') + '</span>\
			</div>');

	});

	$(document).on('focusout', 'input[name=vl_outros]', function (e) {

		if ($(this).val() != "") {
			var vl_outros = moedaParaNumero($(this).val());
		} else {
			var vl_outros = 0;
		}

		if ($('input[name=vl_desconto]').val() != "") {
			var vl_desconto = moedaParaNumero($('input[name=vl_desconto]').val());
		} else {
			var vl_desconto = 0;
		}

		if ($('input[name=vl_produto]').val() != "") {
			var vl_produto = moedaParaNumero($('input[name=vl_produto]').val());
		} else {
			var vl_produto = 0;
		}

		var novo = vl_produto - vl_desconto + vl_outros;

		$('input[name=vl_total]').val(novo);

		$('.txt_total').html('<div class="mr-5 text-right" style="line-height: 1.25;">\
				<span>Total do Pedido</span><br>\
				<span style="font-weight: 800;font-size: 22px;">R$ ' + novo.toFixed(2).replaceAll('.', ',') + '</span>\
			</div>');

	});

	$(document).on('click', '.RemoverMaterial', function (e) {
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
					url: HOST_URL + 'vendas/pedido/sql.php',
					type: 'POST',
					data: {
						type: 'materiais_remove',
						id: id,
					},
					success: function (data, status) {
						//console.log(data);
						var resposta = data.split('||');
						if (resposta[0] == 'success') {
							Swal.fire({
								title: 'Removido!',
								text: 'Produto removido com sucesso!',
								icon: 'success',
								timer: 1000,
								onOpen: function () {
									Swal.showLoading();
								},
							}).then(function (result) {
								var id_pedido = $('#id_pedido').val();

								$.ajax({
									url: '../pedido/sql.php',
									type: 'POST',
									dataType: 'html',
									data: {
										type: 'materiais_view',
										id_pedido: id_pedido,
									},
									success: function (data) {
										var resposta = data.split('||');

										$(".txt_total").html(resposta[2]);

										$("input[name='vl_produto']").val(resposta[1]);

										$('.materiais').html(resposta[0]);
									},
								});
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

});
