using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrsWeb.Models;

namespace PrsWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LineItemsController : ControllerBase
    {
        private readonly PrsDBContext _context;

        public LineItemsController(PrsDBContext context)
        {
            _context = context;
        }

        // GET: api/LineItems     I AM KEEPING THIS FOR TESTING PURPOSES
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LineItem>>> GetLineItems()
        {
            return await _context.LineItems.ToListAsync();
        }

        // GET: api/LineItems/5     REQUIRED MAPPING: api/LineItems/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LineItem>> GetLineItem(int id)
        {
            var lineItem = await _context.LineItems.FindAsync(id);

            if (lineItem == null)
            {
                return NotFound();
            }

            return lineItem;
        }

        // PUT: api/LineItems/5 TR5       REQUIRED MAPPING: api/LineItems/{id}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLineItem(int id, LineItem lineItem)
        {

            if (id != lineItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(lineItem).State = EntityState.Modified;
            var request = await _context.Requests
                .Include(r => r.LineItems)  // Load LineItems for the Request
                    .ThenInclude(li => li.Product)  // For each LineItem, load the Product
                    .FirstOrDefaultAsync(r => r.Id == lineItem.RequestId);// Find the specific Request by RequestId


            try
            {
                _context.LineItems.Update(lineItem);
                await _context.SaveChangesAsync();
                decimal totalCounter = 0m;
                foreach (var item in request.LineItems)
                {
                    totalCounter += item.Product.Price * item.Quantity;
                }
                request.Total = totalCounter;
                //update the request with the new price
                _context.Requests.Update(request);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LineItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // POST: api/LineItems  TR5      REQUIRED MAPPING: api/LineItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LineItem>> PostLineItem(LineItem lineItem, int requestId)
        {
           //changed 11/7/24
            if (lineItem.RequestId == 0 && lineItem.Request != null)
            {
                lineItem.RequestId = lineItem.Request.Id;
            }
            lineItem.Request = null;
            
            _context.LineItems.Add(lineItem);
            await _context.SaveChangesAsync();

            //_context.Entry(lineItem).State = EntityState.Modified;
            var request = await _context.Requests
                .Include(r => r.LineItems)
                .ThenInclude(li => li.Product)
                .FirstOrDefaultAsync(r => r.Id == lineItem.RequestId);

            //recalculate request total
            decimal totalCounter = 0m;
            foreach (var item in request.LineItems)
            {
                totalCounter += item.Product.Price * item.Quantity;
            }
            request.Total = totalCounter;
            //update the request with the new price
            _context.Requests.Update(request);
            await _context.SaveChangesAsync();


            return lineItem;
        }


        private void nullifyAndSetId(LineItem lineitem)//added this method 11/7/24
        {
            if (lineitem != null)
            {
                if (lineitem.RequestId == 0)
                {
                    lineitem.RequestId = lineitem.Request.Id;
                }
                lineitem.Request = null;
              
            }
        }

        // DELETE: api/LineItems/5          REQUIRED MAPPING: api/LineItems/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLineItem(int id)
        {
            var lineItem = await _context.LineItems.FindAsync(id);
            if (lineItem == null)
            {
                return NotFound();
            }
            //remove the lineitem from the request
            _context.LineItems.Remove(lineItem);
            //save request without the lineitem
            await _context.SaveChangesAsync();
            //bring in the request connected to the lineitem/product
            var request = await _context.Requests
                .Include(r => r.LineItems)
                .ThenInclude(li => li.Product)
                .FirstOrDefaultAsync(r => r.Id == lineItem.RequestId);
            //if handles if the request is null/non-existent
            if (request == null)
            {
                return NotFound();
            }

            //recalculate request total
            decimal totalCounter = 0m;
            foreach (var item in request.LineItems)
            {
                if (item.Product == null)
                {
                    return NotFound();
                }
                totalCounter += item.Product.Price * item.Quantity;
            }
            request.Total = totalCounter;
            //update the request with the new price (minus the deleted lineitem)
            _context.Requests.Update(request);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Get all line items for a request TR 4          REQUIRED MAPPING: api/LineItems/lines-for-req/{reqId}
        [HttpGet("lines-for-req/{requestId}")]
        public async Task<ActionResult<IEnumerable<LineItem>>>
    GetLineItemsForRequestId(int requestId)
        {
            var lineitems = await _context.LineItems.Include(i => i.Request)
                .Include(i => i.Product)
                .Where(i => i.RequestId == requestId)
                .ToListAsync();
            if (lineitems == null) { return NoContent(); }
            return lineitems;
        }


        private bool LineItemExists(int id)
        {
            return _context.LineItems.Any(e => e.Id == id);
        }

    }
}
