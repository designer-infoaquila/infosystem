'use strict';

// Class definition
var KTFornecedorEdit = (function () {
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
			var validator = _validations[0]; // get validator for currnt step

			if (validator) {
				validator.validate().then(function (status) {
					if (status == 'Valid') {
						var data = new FormData();

						//Form data
						var form_data = $('#fornecedor_edit_form').serializeArray();
						$.each(form_data, function (key, input) {
							data.append(input.name, input.value);
						});

						//Custom data
						data.append('key', 'value');

						$.ajax({
							url: HOST_URL + 'empresas/fornecedor/sql.php',
							type: 'POST',
							data: data,
							processData: false,
							contentType: false,
							success: function (data, status) {
								//console.log(data);
								var resposta = data.split('||');
								if (resposta[0] == 'success') {
									Swal.fire({
										title: 'Atualizado!',
										text: 'Fornecedor atualizado com sucesso!',
										icon: 'success',
										timer: 1000,
										onOpen: function () {
											Swal.showLoading();
										},
									}).then(function (result) {
										window.location.href = HOST_URL + 'empresas/fornecedor';
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
									html: 'Fornecedor não foi atualizado!',
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
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		// Step 1
		_validations.push(
			FormValidation.formValidation(_formEl, {
				fields: {
					fields: {
						codigo: {
							validators: {
								notEmpty: {
									message: 'Código é Necessário',
								},

							},
						},
						pessoa: {
							validators: {
								notEmpty: {
									message: 'Pessoa é Necessário',
								},

							},
						},
						tipo_fornecedor: {
							validators: {
								notEmpty: {
									message: 'TIpo de Fornecedor é Necessário',
								},

							},
						},
						contato: {
							validators: {
								notEmpty: {
									message: 'Contato é Necessário',
								},

							},
						},
						nome: {
							validators: {
								notEmpty: {
									message: 'Campo dinâmico é Necessário',
								},

							},
						},
						nomes: {
							validators: {
								notEmpty: {
									message: 'Campo dinâmico é Necessário',
								},
							},
						},
						email: {
							validators: {
								notEmpty: {
									message: 'E-mail é Necessário',
								},
								emailAddress: {
									message: 'Preencha um e-mail valido!',
								},
							},
						},
						documento: {
							validators: {
								notEmpty: {
									message: 'Documento é Necessário',
								},
								/*
								id: {
									// The id validator is enabled by default
									enabled: true,
									country: 'BR',
									message: 'Preencha um CPF válido',
								},
								vat: {
									// The vat validator is disabled initially
									enabled: false,
									country: 'BR',
									message: 'Preencha um CNPJ válido',
								},
								*/
							},
						},
						celular: {
							validators: {
								notEmpty: {
									message: 'Celular é Necessário',
								},

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

	/*
	document.querySelector('[name="documento"]').addEventListener('keyup', function (e) {
		switch (e.target.value.length) {
			// User is trying to put a VAT number
			case 18:
				_validations[0]
					// Disable the id validator
					.disableValidator('documento', 'id')
					// Enable the vat one
					.enableValidator('documento', 'vat')
					// Revalidate field
					.revalidateField('documento');
				break;

			// User is trying to put an ID number
			case 14:
			default:
				_validations[0].enableValidator('documento', 'id').disableValidator('documento', 'vat').revalidateField('documento');
				break;
		}
	});
	*/

	window.addEventListener('load', function (e) {
		const quantidade = document.querySelector('[name="documento"]').value.length;
		switch (quantidade) {
			// User is trying to put a VAT number
			case 18:
				_validations[0]
					// Disable the id validator
					.disableValidator('documento', 'id')
					// Enable the vat one
					.enableValidator('documento', 'vat')
					// Revalidate field
					.revalidateField('documento');

				break;

			// User is trying to put an ID number
			case 14:
			default:
				_validations[0].enableValidator('documento', 'id').disableValidator('documento', 'vat').revalidateField('documento');
				break;
		}
	});

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('fornecedor_edit');
			_formEl = KTUtil.getById('fornecedor_edit_form');

			_initWizard();
			_initValidation();
		},
	};
})();

jQuery(document).ready(function () {
	KTFornecedorEdit.init();

	$('.menu-item-submenu:nth-child(2)').addClass('menu-item-open menu-item-here');
	$('.menu-empresas .menu-item:nth-child(2)').addClass('menu-item-active');

	var pessoa = $("select[name=pessoa] option:selected").val();

	if (pessoa == 'juridica') {
		$('.alter-name-1').html('Nome Fantasia:');
		$('.alter-name-1').attr('placeholder', 'Nome Fantasia');

		$('.alter-name-2').html('Razão Social:');
		$('.alter-name-2').attr('placeholder', 'Razão Social');

		$('.alter-doc-1').addClass('cnpjMask');
		$('.alter-doc-1').removeClass('cpjMask');

		$('.alter-doc-1').html('CNPJ:');
		$('.alter-doc-1').attr('placeholder', 'CNPJ');

		$('.alter-doc-2').html('Insc. Estadual:');
		$('.alter-doc-2').attr('placeholder', 'Insc. Estadual');

	}
	if (pessoa == 'fisica') {
		$('.alter-name-1').html('Nome');
		$('.alter-name-1').attr('placeholder', 'Nome');

		$('.alter-name-2').html('Sobrenome');
		$('.alter-name-2').attr('placeholder', 'Sobrenome');

		$('.alter-doc-1').addClass('cpfMask');
		$('.alter-doc-1').removeClass('cnpjMask');

		$('.alter-doc-1').html('CPF:');
		$('.alter-doc-1').attr('placeholder', 'CPF');

		$('.alter-doc-2').html('RG:');
		$('.alter-doc-2').attr('placeholder', 'RG');

	}

	$(document).on('change', 'select[name=pessoa]', function (e) {
		e.preventDefault();

		var valor = $(this).val();

		if (valor == 'juridica') {
			$('.alter-name-1').html('Nome Fantasia:');
			$('.alter-name-1').attr('placeholder', 'Nome Fantasia');

			$('.alter-name-2').html('Razão Social:');
			$('.alter-name-2').attr('placeholder', 'Razão Social');

			$('.alter-doc-1').addClass('cnpjMask');
			$('.alter-odc-1').removeClass('cpjMask');

			$('.cnpjMask').mask('00.000.000/0000-00', {
				reverse: true,
			});

			$('.alter-doc-1').html('CNPJ:');
			$('.alter-doc-1').attr('placeholder', 'CNPJ');

			$('.alter-doc-2').html('Insc. Estadual:');
			$('.alter-doc-2').attr('placeholder', 'Insc. Estadual');

		}
		if (valor == 'fisica') {
			$('.alter-name-1').html('Nome');
			$('.alter-name-1').attr('placeholder', 'Nome');

			$('.alter-name-2').html('Sobrenome');
			$('.alter-name-2').attr('placeholder', 'Sobrenome');

			$('.alter-doc-1').addClass('cpfMask');
			$('.alter-doc-1').removeClass('cnpjMask');

			$('.cpfMask').mask('000.000.000-00', {
				reverse: true,
			});

			$('.alter-doc-1').html('CPF:');
			$('.alter-doc-1').attr('placeholder', 'CPF');

			$('.alter-doc-2').html('RG:');
			$('.alter-doc-2').attr('placeholder', 'RG');

		}
	});
});
