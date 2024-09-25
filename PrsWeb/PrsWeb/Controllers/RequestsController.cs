using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrsWeb.Models;
using System.Security.Claims;


namespace PrsWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        
        private readonly PrsDBContext _context;

        public RequestsController(PrsDBContext context)
        {
            _context = context;
        }

        // GET: api/Requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequests()
        {
            return await _context.Requests.ToListAsync();
        }

        // GET: api/Requests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Request>> GetRequest(int id)
        {
            var request = await _context.Requests.FindAsync(id);

            if (request == null)
            {
                return NotFound();
            }

            return request;
        }

        // PUT: api/Requests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRequest(int id, Request request)
        {
            if (id != request.Id)
            {
                return BadRequest();
            }

            _context.Entry(request).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RequestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Requests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Request>> PostRequest(Request request)
        {
            request.SubmittedDate = DateTime.Now;
            request.Total = 0.0m;
            request.Status = "NEW";
            _context.Requests.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRequest", new { id = request.Id }, request);
        }

        // DELETE: api/Requests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var request = await _context.Requests.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RequestExists(int id)
        {
            return _context.Requests.Any(e => e.Id == id);
        }

        //get all line items with the same request ID number
        [HttpGet("requests/{requestId}")]
        public async Task<ActionResult<IEnumerable<LineItem>>>
            GetLineItemsForRequestId(int requestId)
        {
            var lineitems = await _context.LineItems.Include(i => i.Request)
                .Include(i => i.Product)
                .Where(i => i.RequestId == requestId)
                .ToListAsync();
            return lineitems;
        }

        //Request Submitted for Review
        [HttpPut("request/submit")]
        public async Task<IActionResult> SubmitForReviewRequest(int id, Request request)
        {
            _context.Entry(request).State = EntityState.Modified;
            if (request.Total > 50)
            {
                request.Status = "APPROVED";
                await _context.SaveChangesAsync();
                return NoContent();
            }
            else
            {
                request.Status = "REVIEW";
                await _context.SaveChangesAsync();
                return NoContent();
            }
        }

        //Get all requests for review meeting criteria
        [HttpGet("request/review/{id}")]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequestsForReview(int id)
        {
            var requstsReview = await _context.Requests.
                Where(r => r.Status == "REVIEW").
                Where(r => r.UserId != id)
                .ToListAsync();
            return requstsReview;
        }

        //Request Approve
        [HttpPut("request/approved")]
        public async Task<IActionResult> RequestApproved(int id, Request request)
        {
            _context.Entry(request).State = EntityState.Modified;
            request.Status = "APPROVED";
            await _context.SaveChangesAsync();
            return NoContent();
        }

        //Request Rejected
        [HttpPut("request/rejected")]
        public async Task<IActionResult> RequestDenied(int id, Request request)
        {
            _context.Entry(request).State = EntityState.Modified;
            request.Status = "REJECTED";
            await _context.SaveChangesAsync();
            return NoContent();
        }

        //Method to Recalculate the request total when Line Items Add/Delete/Update
        [HttpPut("request/recalculate")]
        public async Task<ActionResult<Request>>
            RecalculateRequestsAfterLineItemChange(Request request, int id)
        {

            var lineItemResult = await GetLineItemsForRequestId(id);
            var lineItems = lineItemResult.Value.ToList();

            decimal totalCounter = 0m;
            for (int i = 0; i < lineItems.Count; i++)
            {
                totalCounter += lineItems[i].Product.Price * lineItems[i].Quantity;
            }
            request.Total = totalCounter;
            _context.Requests.Update(request);
            await _context.SaveChangesAsync();

            return Ok(request);
        }

    }
}
