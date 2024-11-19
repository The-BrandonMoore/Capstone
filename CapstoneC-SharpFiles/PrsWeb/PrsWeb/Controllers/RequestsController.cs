using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrsWeb.Models;
using System.Text;
using Request = PrsWeb.Models.Request;


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

        // GET: api/Requests/    REQUIRED MAPPING: api/Requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequests()
        {
            return await _context.Requests.Include(r => r.User).ToListAsync();
            //11/6/24 -- added .Include(r => r.User) to fix null user issue.

        }

        // GET: api/Requests/5     REQUIRED MAPPING: api/Requests/id
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

        // PUT: api/Requests     REQUIRED MAPPING: api/Requests/id
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

        // POST: api/Requests       REQUIRED MAPPING: api/Requests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Request>> PostRequest(RequestForm requestForm)
        {
            Request request = new Request
            {
                UserId = requestForm.UserId,
                Description = requestForm.Description,
                Justification = requestForm.Justification,
                DateNeeded = requestForm.DateNeeded,
                DeliveryMode = requestForm.DeliveryMode,
                SubmittedDate = DateTime.Now,
                Status = "NEW",
                Total = 0.0m
            };

            nullifyAndSetId(request);
            //makes the new request number
            string lastRequest = _context.Requests.Max(r => r.RequestNumber);
            int lastFour = int.Parse(lastRequest.Substring(7)) + 1;
            StringBuilder requestNumberStr = new();
            string dateStr = DateTime.Now.ToString("yyMMdd");
            request.RequestNumber = requestNumberStr.Append("R" + dateStr + lastFour.ToString().PadLeft(4, '0')).ToString();

            //adds and saves the new request
            _context.Requests.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRequest", new { id = request.Id }, request);
        }

        private void nullifyAndSetId(Request request)
        {
            if (request.User != null)
            {
                if (request.UserId == 0)
                {
                    request.UserId = request.User.Id;
                }
                request.User = null;
            }
        }

        // DELETE: api/Requests/5     REQUIRED MAPPING: api/Requests/id
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

        // submit a request for review      REQUIRED MAPPING: api/Requests/submit-review/{id}
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

        //Get all requests for review meeting criteria TR7     REQUIRED MAPPING: api/Requests/list-review/{userId}
        [HttpGet("list-review/{userId}")]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequestsForReview(int userId)
        {
            var requstsReview = await _context.Requests.
                Where(r => r.Status == "REVIEW").
                Where(r => r.UserId != userId)
                .ToListAsync();
            return requstsReview;
        }


        //Request Approve TR11      REQUIRED MAPPING: api/Requests/approve/{id}
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

        //Request Rejected TR12      REQUIRED MAPPING: api/Requests/reject/{id}
        [HttpPut("reject/{id}")]
        public async Task<ActionResult<Request>> RequestDenied(int id, RequestRejected requestRejected)
        {
            var result = await GetRequest(id);
            Request request = result.Value;
            _context.Entry(request).State = EntityState.Modified;
            request.Status = "REJECTED";
            request.ReasonForRejection = requestRejected.ReasonForRejection;
            await _context.SaveChangesAsync();
            return request;
        }
    }
}
