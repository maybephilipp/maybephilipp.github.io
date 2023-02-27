// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc = '//unpkg.com/pdfjs-dist/build/pdf.worker.js';

// Some PDFs need external cmaps.
//
const CMAP_URL = "//unpkg.com/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

const DEFAULT_URL = '../Frametastic_Guidance.pdf';
const SCALE = 1.0;

const ENABLE_XFA = true;

const container = document.getElementById("pageContainer");

const eventBus = new pdfjsViewer.EventBus();

// Loading document.
const loadingTask = pdfjsLib.getDocument({
  url: DEFAULT_URL,
  cMapUrl: CMAP_URL,
  cMapPacked: CMAP_PACKED,
  enableXfa: ENABLE_XFA,
});
(async function () {
  let pageNum = 1
  let pageRendering = false
  let pageNumPending = null

  const pdfDocument = await loadingTask.promise;

  let pdfPageView = null
  
  function renderPage(num) {
    console.log('render num', num)
    pageRendering = true;
    // Using promise to fetch the page
    pdfDocument.getPage(num).then(function(page) {
      console.log('cbk')
      if (!pdfPageView) {
        pdfPageView = new pdfjsViewer.PDFPageView({
          container,
          id: num,
          scale: SCALE,
          defaultViewport: page.getViewport({ scale: SCALE }),
          eventBus,
        });
      }

      console.log('set page', page)

      pdfPageView.setPdfPage(page);

      pdfPageView.draw().then(function() {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });
  
    // Update page counters
    document.getElementById('page_num').textContent = num;
  }
  
  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  /**
   * Displays previous page.
   */
  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }
  document.getElementById('prev').addEventListener('click', onPrevPage);

  /**
   * Displays next page.
   */
  function onNextPage() {
    if (pageNum >= pdfDocument.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }
  document.getElementById('next').addEventListener('click', onNextPage);

  document.getElementById('page_count').textContent = pdfDocument.numPages;
  
  renderPage(pageNum)
})();
