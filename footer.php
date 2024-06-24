<!--begin::Footer-->
<div class="footer py-4 d-flex flex-lg-column" id="kt_footer">
    <!--begin::Container-->
    <div class="container d-flex flex-column flex-md-row align-items-center justify-content-between">
        <!--begin::Copyright-->
        <div class="text-dark order-2 order-md-1">
            <span class="text-muted font-weight-bold mr-2">2023©</span>
            <a href="#" target="_blank" class="text-white text-hover-primary">InfoSystem</a>
        </div>
        <!--end::Copyright-->
        <!--begin::Nav-->
        <div class="nav nav-dark order-1 order-md-2">
            <a href="#" target="_blank" class="nav-link pr-3 pl-0 text-muted text-hover-primary">Sobre</a>
            <a href="#" target="_blank" class="nav-link px-3 text-muted text-hover-primary">Time</a>
            <a href="#" target="_blank" class="nav-link pl-3 pr-0 text-muted text-hover-primary">Contato</a>
        </div>
        <!--end::Nav-->
    </div>
    <!--end::Container-->
</div>
<!--end::Footer-->
</div>
<!--end::Wrapper-->
</div>
<!--end::Page-->
</div>
<!--end::Main-->

<!-- Modal-->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Base do Orçamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i aria-hidden="true" class="ki ki-close"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class=" row">
                    <div class="col-xl-12">
                        <div class="form-group row mb-5">
                            <label class="col-form-label col-xl-3 col-lg-3">Valor Base</label>
                            <div class="col-lg-9 col-xl-9">
                                <div class="input-group">
                                    <input type="text" class="form-control form-control-sm moneyMask" placeholder="Valor Base" id="valor" value="<?= number_format($l['valor'], "2", ",", "."); ?>">
                                    <div class="input-group-append">
                                        <span class="input-group-text">
                                            <i class="la la-dollar-sign icon-lg"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=" row">
                    <div class="col-xl-12">
                        <div class="form-group row mb-5">
                            <label class="col-form-label col-xl-3 col-lg-3">Coeficiente:</label>
                            <div class="col-lg-9 col-xl-9">
                                <div class="input-group">
                                    <input type="text" class="form-control form-control-sm moneyMask" placeholder="Coeficiente" id="coeficiente" value="<?= number_format($l['coeficiente'], "2", ",", "."); ?>">
                                    <div class="input-group-append">
                                        <span class="input-group-text">
                                            <i class="la la-expand icon-lg"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-primary font-weight-bold" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<!--begin::Scrolltop-->
<div id="kt_scrolltop" class="scrolltop">
    <span class="svg-icon">
        <!--begin::Svg Icon | path:assets/media/svg/icons/Navigation/Up-2.svg-->
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <polygon points="0 0 24 0 24 24 0 24" />
                <rect fill="#000000" opacity="0.3" x="11" y="10" width="2" height="10" rx="1" />
                <path d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z" fill="#000000" fill-rule="nonzero" />
            </g>
        </svg>
        <!--end::Svg Icon-->
    </span>
</div>
<!--end::Scrolltop-->

<script>
    var HOST_URL = "<?= $url ?>";
</script>
<!--begin::Global Config(global config for global JS scripts)-->
<script>
    var KTAppSettings = {
        "font-family": "Poppins"
    };
</script>
<!--end::Global Config-->
<!--begin::Global Theme Bundle(used by all pages)-->
<script src="<?= $url ?>assets/js/plugins.bundle.js"></script>
<script src="<?= $url ?>assets/js/prismjs.bundle.js"></script>
<script src="<?= $url ?>assets/js/scripts.bundle.js"></script>
<!--end::Global Theme Bundle-->

<!--begin::Page Scripts(used by this page)-->
<script src="<?= $url ?>assets/js/widgets.js"></script>
<script src="<?= $url ?>assets/js/jquery-mask.js"></script>
<script src="<?= $url ?>assets/js/datatables.bundle.js"></script>
<!--end::Page Scripts-->
</body>
<!--end::Body-->

</html>