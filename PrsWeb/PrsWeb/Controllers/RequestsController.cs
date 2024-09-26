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

        // GET: api/Requests/
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

        // PUT: api/Requests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRequest(int id, Request request)
        {
            if (id != request.Id)
            {
                return NotFound();
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
            request.UserId = 3;
            request.RequestNumber = "1803";
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
        //[HttpGet("requests/{requestId}")]
        //public async Task<ActionResult<IEnumerable<LineItem>>>
        //    GetLineItemsForRequestId(int requestId)
        //{
        //    var lineitems = await _context.LineItems.Include(i => i.Request)
        //        .Include(i => i.Product)
        //        .Where(i => i.RequestId == requestId)
        //        .ToListAsync();
        //    return lineitems;
        //}

        //Request Submitted for Review TR6
        [HttpPut("submit-review/{id}")]
        public async Task<ActionResult<Request>> SubmitForReviewRequest(int id, Request request)
        {
            _context.Entry(request).State = EntityState.Modified;
            if (request.Total <= 50)
            {
                request.Status = "APPROVED"; 
                request.SubmittedDate = DateTime.Now;
                await _context.SaveChangesAsync();
                return request;
            }
            else
            {
                request.Status = "REVIEW";
                request.SubmittedDate = DateTime.Now;
                await _context.SaveChangesAsync();
                return request;
            }
        }

        //Get all requests for review meeting criteria TR7
        [HttpGet("list-review/{userId}")]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequestsForReview(int userId)
        {
            var requstsReview = await _context.Requests.
                Where(r => r.Status == "REVIEW").
                Where(r => r.UserId != userId)
                .ToListAsync();
            return requstsReview;
        }

        //Request Approve TR11
        [HttpPut("approve/{id}")]
        public async Task<ActionResult<Request>> RequestApproved(int id)
        {
            var result = await GetRequest(id);
            Request request = result.Value;
            _context.Entry(request).State = EntityState.Modified;
            request.Status = "APPROVED";
            await _context.SaveChangesAsync();
            return request;
        }

        //Request Rejected TR12
        [HttpPut("reject/{id}")]
        public async Task<ActionResult<Request>> RequestDenied(int id, object reasonForRejection)
        {
            var result = await GetRequest(id);
            Request request = result.Value;
            _context.Entry(request).State = EntityState.Modified;
            request.Status = "REJECTED";
            string reason = System.Text.Json.JsonSerializer.Serialize(reasonForRejection);
            request.ReasonForRejection = reason;
            await _context.SaveChangesAsync();
            return request;
        }

        //Method to Recalculate the request total when Line Items Add/Delete/Update
        //[HttpPut("request/recalculate")]
        //public async Task<ActionResult<Request>>
        //    RecalculateRequestsAfterLineItemChange(int requestId)
        //{
        //    var requestResult = await GetRequest(requestId); // gets the request we are recalculating
        //    Request request = requestResult.Value; //changes the var type to a Request type

        //    var lineItemResult = await GetLineItemsForRequestId(requestId); //returns lineitems for requestID
        //    var lineItems = lineItemResult.Value.ToList();//sends lineItems to a list
        //    decimal totalCounter = 0m;
        //    foreach (var lineItem in lineItems)//loops through the list and adds the total price of each line item to the total counter
        //    {
        //        totalCounter += lineItem.Product.Price * lineItem.Quantity;
        //    }
        //    request.Total = totalCounter;
        //    _context.Requests.Update(request);
        //    await _context.SaveChangesAsync();

        //    return Ok(request);
        //}

    }
}
