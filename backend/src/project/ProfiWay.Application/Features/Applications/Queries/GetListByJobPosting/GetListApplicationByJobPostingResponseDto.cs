﻿

using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Applications.Queries.GetList;

public class GetListApplicationByJobPostingResponseDto
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public int JobPostingId { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
}
